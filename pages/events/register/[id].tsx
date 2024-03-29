import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { StepStatus } from "../../../lib/enums";
import StepsMobile from "../../../components/EventPages/StepsMobile";
import StepsDesktop, {
  Step,
} from "../../../components/EventPages/StepsDesktop";
import { FaChevronLeft } from "react-icons/fa";
import Loading from "../../../components/Loading";
import Layout from "../../../components/Layout";
import ConfirmationPage from "../../../components/EventPages/Fan/RegisterEventForms/ConfirmationPage";
import TicketSelectionFormPage from "../../../components/EventPages/Fan/RegisterEventForms/TicketSelectionFormPage";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { User, Ticket } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { EventWithAllDetails, UserWithTickets } from "../../../utils/types";
import { ethers } from "ethers";
import contract from "../../../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json";
import { API_URL, smartContract } from "../../../lib/constant";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import Link from "next/link";
import { fetchPostJSON } from "../../../lib/stripe/api-helpers";
import getStripe from "../../../lib/stripe";
import { useRouter } from "next/router";
import { sendEmail, sendSMS } from "../../../lib/api-helpers/communication-api";
import { saveUserTicket } from "../../../lib/api-helpers/ticket-api";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";

export type SelectedTicket = {
  ticketId: number | undefined;
  ticketName: string;
  qty: number;
  price: number;
  stripePriceId: string;
};

export type TicketsForm = User & {
  selectedTicket: SelectedTicket;
  preDiscountedTickets: Ticket[];
  discountedTickets: Ticket[];
  stripePromotionId: string;
};

type FanEventReigsterProps = {
  userData: User;
  event: EventWithAllDetails;
};

const FanEventRegister = ({ userData, event }: FanEventReigsterProps) => {
  const { data: session, status } = useSession();
  const userId = session?.user.userId;
  const router = useRouter();

  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
  );
  const abi = contract.abi;
  const bytecode = contract.bytecode;
  var signer = new ethers.Wallet(smartContract.privateKey, provider);

  // use form for selected ticket state
  const { handleSubmit, setValue, reset, control, watch, trigger } =
    useForm<TicketsForm>({
      defaultValues: {
        ...userData,
        selectedTicket: {
          ticketId: undefined,
          ticketName: "",
          qty: 0,
          price: 0,
          stripePriceId: "",
        },
        preDiscountedTickets: event.tickets,
        discountedTickets: [],
      },
    });

  // watch user form data
  const formData = watch();
  const [isPromoApplied, setIsPromoApplied] = useState<boolean>(false);
  const [isRegisterSuccessModalOpen, setIsRegisterSuccessModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [steps, setSteps] = useState<Step[]>([
    { id: "Step 1", name: "Select Tickets", status: StepStatus.CURRENT },
    { id: "Step 2", name: "Confirm Registration", status: StepStatus.UPCOMING },
  ]);

  // email html body
  const htmlBody: string = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
      <title>Ticket Notification</title>
      <style>
        /* Center all elements and set text color */
        body {
          display: flex;
          justify-content: center;
          text-align: center;
          color: #34383F;
        }
        /* Add some space between elements */
        img, h1, p, a {
          margin: 10px auto;
          display: block;
          text-align: center;
        }
        /* Style the button */
        a.button {
          background: #1A7DFF;
          color: #FFFFFF;
          border-radius: 0.375rem;
          border: none;
          padding: 0.75rem 1rem;
          text-decoration: none;
          display: inline-block;
          transition: background-color 0.3s ease;
          font-weight: 600;
          margin: 0 auto;
        }
        /* Style the button hover */
        a.button:hover {
          background: #1A54C2;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
        <!-- Logo -->
        <img style="margin-top: 4rem" src="https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/event-profile/connexa-logo.png" alt="Logo" width="200">
        <!-- Greeting -->
        <h1 style="margin-top: 2rem; margin-bottom: 0rem">${userData.displayName},</h1>
        <h1 style="margin-top: 0rem;">you've got tickets!</h1>
        <!-- Button to view the event -->
        <div style="display: flex; justify-content: center; margin-top: 3rem; margin-bottom: 10rem">
          <a class="button" href="http://connexus.com/events/tickets" style="display: flex; justify-content: center;">View Event</a>  
        </div>      
      </body>
  </html>
  `;

  // checks if payment succeeeded and call mint api
  useEffect(() => {
    const paymentSuccessExists = "paymentSuccess" in router.query;
    console.log("payment success exists? -> ", paymentSuccessExists);
    console.log("query param value -> ", router.query.paymentSuccess);

    // on payment success
    if (paymentSuccessExists && router.query.paymentSuccess === "true") {
      // fetch ticket from local storage
      const savedFormData: any = localStorage.getItem("savedFormData")
        ? JSON.parse(localStorage.getItem("savedFormData")!)
        : null;
      console.log("local storage data ->", savedFormData);
      // show user previously selected ticket in order summary
      setValue("selectedTicket", {
        ticketId: savedFormData.selectedTicket.ticketId,
        ticketName: savedFormData.selectedTicket.ticketName,
        qty: savedFormData.selectedTicket.qty,
        price: savedFormData.selectedTicket.price,
        stripePriceId: savedFormData.stripePriceId,
      });

      // show user previously entered phone number in order summary
      setValue("phoneNumber", savedFormData.updatedUser.phoneNumber);

      // bring users back to confirmation page
      setSteps([
        { id: "Step 1", name: "Select Tickets", status: StepStatus.COMPLETE },
        {
          id: "Step 2",
          name: "Confirm Registration",
          status: StepStatus.CURRENT,
        },
      ]);

      mintTicket(
        savedFormData.updatedUser,
        Number(savedFormData.updatedUser.userId),
        event.eventId,
        savedFormData.selectedTicket.ticketName,
        savedFormData.selectedTicket.ticketId
      );
      localStorage.removeItem("savedFormData");

      // send email
      sendEmail(
        userData.email,
        `Registration Confirmation for ${event.eventName}`,
        "Event Confirmation",
        htmlBody
      );

      if (userData.phoneNumber) {
        sendSMS(
          userData.phoneNumber,
          `[Connexus] Hey ${userData.displayName}! You've registered for ${event.eventName}, take a look at your tickets in Connexus! http://connexus.com/events/tickets`
        );
      }
    }
  }, [router.query]);

  const getCurrentStep = (): Step | undefined => {
    return steps.find((step) => step.status === StepStatus.CURRENT);
  };

  const proceedStep = (): void => {
    switch (getCurrentStep()?.id) {
      case "Step 1":
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "Step 1"
              ? { ...step, status: StepStatus.COMPLETE }
              : step.id === "Step 2"
              ? { ...step, status: StepStatus.CURRENT }
              : step
          )
        );
        break;
      case "Step 2":
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "Step 2"
              ? { ...step, status: StepStatus.COMPLETE }
              : step.id === "Step 3"
              ? { ...step, status: StepStatus.CURRENT }
              : step
          )
        );
        break;
      default:
        break;
    }
  };

  const reverseStep = (): void => {
    switch (getCurrentStep()?.id) {
      case "Step 2":
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "Step 1"
              ? { ...step, status: StepStatus.CURRENT }
              : step.id === "Step 2"
              ? { ...step, status: StepStatus.UPCOMING }
              : step
          )
        );
        break;
      case "Step 3":
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "Step 2"
              ? { ...step, status: StepStatus.CURRENT }
              : step.id === "Step 3"
              ? { ...step, status: StepStatus.UPCOMING }
              : step
          )
        );
        break;
      default:
        break;
    }
  };

  // memoizing so that react only calculates the current step when it changes
  const currentStep: Step | undefined = useMemo(
    () => getCurrentStep(),
    [getCurrentStep]
  );

  const mintOnChain = async (
    eventInfo: Partial<EventWithAllDetails>,
    ticket_category: string // ticket name
  ) => {
    console.log(ticket_category);
    const { eventName, addressId, startDate, endDate } = eventInfo;
    let response_location = await axios.get(
      `${API_URL}/addresses/` + addressId
    );

    // stringy data to store on pinata
    let metaData = JSON.stringify({
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: "testing",
        keyvalues: {
          customKey: "customValue",
          customKey2: "customValue2",
        },
      },
      pinataContent: {
        event: eventName,
        location: response_location.data.locationName,
        startDate: startDate,
        endDate: endDate,
        category: ticket_category,
      },
    });

    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    return axios.post(url, metaData, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: smartContract.pinataApiKey,
        pinata_secret_api_key: smartContract.pinataSecretApiKey,
      },
    });
  };

  const mintTicket = async (
    userFormData: User,
    userId: number,
    eventId: number,
    ticketCategory: string,
    selectedTicketId: number
  ) => {
    setIsLoading(true);
    setIsRegisterSuccessModalOpen(true);
    let response = await axios.get(`${API_URL}/events/` + eventId.toString());
    const eventInfo = response.data as EventWithAllDetails;
    const { eventScAddress, ticketURIs, tickets } = eventInfo;

    let user_response = await axios.get(
      `${API_URL}/users/` + userId.toString()
    );
    const userInfo = user_response.data as UserWithTickets;
    var user_tickets = userInfo.tickets;

    //Mint + IPFS
    response = await mintOnChain(eventInfo, ticketCategory);
    let ipfsHash = response.data.IpfsHash;
    console.log(ipfsHash);

    if (ipfsHash == "") return;
    const link = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
    console.log("IPFS Hash Link  : ", link);
    const event_contract = new ethers.Contract(eventScAddress, abi, signer);
    console.log("smart contract address ->", eventScAddress);
    const category_info = await event_contract.getCategoryInformation(
      ticketCategory
    );
    const price_needed = category_info._price._hex;
    console.log(price_needed);
    console.log("output : ", parseInt(price_needed, 16));
    const mint_ticket = await event_contract.mint(
      userInfo.walletAddress,
      ticketCategory,
      link,
      {
        gasLimit: 2100000,
        value: price_needed,
      }
    );
    console.log("minted ticket user wallet address ->", userInfo.walletAddress);
    console.log("returned ticket hash -> ", mint_ticket.hash);

    for (let j = 0; j < tickets.length; j++) {
      if (tickets[j].name == ticketCategory) {
        console.log(tickets[j].currentTicketSupply);
        var ticket = {
          ticketId: tickets[j].ticketId,
          name: tickets[j].name,
          totalTicketSupply: tickets[j].totalTicketSupply,
          currentTicketSupply: tickets[j].currentTicketSupply + 1,
          price: tickets[j].price,
          startDate: tickets[j].startDate,
          endDate: tickets[j].endDate,
          description: tickets[j].description,
        };
        let response_tickets = await axios.post(
          `${API_URL}/tickets/` + tickets[j].ticketId.toString(),
          ticket
        );
        user_tickets.push(tickets[j]);

        // destructure from user form data
        const { displayName, email, phoneNumber } = userFormData;

        // upsert user with minted tickets and profile info
        const updated_user = {
          ...userInfo,
          displayName,
          email,
          phoneNumber,
          tickets: user_tickets,
        };
        console.log("updating user in prisma, form data ->", updated_user);
        let user_update = await axios.post(
          `${API_URL}/users/` + userId.toString(),
          updated_user
        );
        console.log(user_update);

        break;
      }
    }
    ticketURIs.push(link);

    // remove certain fields for api to work
    const {
      address,
      tickets: tempTickets,
      userLikes,
      ...eventWOSomeFields
    } = eventInfo;

    // construct update event
    const updated_event = {
      ...eventWOSomeFields,
      ticketURIs: ticketURIs,
    };

    console.log("posting updated event ->", updated_event);
    let updated_response = await axios.post(
      `${API_URL}/events/` + eventId.toString(),
      updated_event
    );
    let updated_data = updated_response.data;

    // add userTicket record to db (attendee)
    console.log("selected ticket id ->", selectedTicketId);
    console.log("userId ->", userId);
    const res = await saveUserTicket(selectedTicketId, userId);
    console.log("Data uploaded for both event + user");
    setIsLoading(false);
  };

  return (
    <ProtectedRoute>
      <Layout>
        {/* Register success modal */}
        <Modal
          isOpen={isRegisterSuccessModalOpen}
          setIsOpen={setIsRegisterSuccessModalOpen}
        >
          {isLoading ? (
            <Loading className="!h-full !bg-transparent" />
          ) : (
            <div className="flex flex-col gap-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Purchase Completed!
              </h3>
              <h3 className="text-md font-normal text-gray-500">
                You have successfully purchased{" "}
                {formData.selectedTicket.ticketName} for {event.eventName}!
              </h3>

              <Link href="/events/tickets">
                <Button
                  variant="solid"
                  size="md"
                  className="border-0"
                  onClick={() => setIsRegisterSuccessModalOpen(false)}
                >
                  Got it, thanks!
                </Button>
              </Link>
            </div>
          )}
        </Modal>

        <main className="py-12 px-4 sm:px-12">
          {/* Header */}
          <nav className="flex items-center gap-6">
            {currentStep?.id !== "Step 1" && (
              <FaChevronLeft
                className="text-lg text-blue-600 hover:cursor-pointer sm:text-xl"
                onClick={reverseStep}
              />
            )}
            <h2 className="text-2xl font-bold text-gray-900 sm:text-4xl">
              {currentStep?.id === "Step 1"
                ? "Register for Event"
                : currentStep?.id === "Step 2"
                ? "Select Tickets"
                : "Confirm Registration"}
            </h2>
          </nav>

          {/* Steps */}
          <div className="justify-cente relative text-gray-900 sm:py-8">
            {/* conditionally rendered via css */}
            <StepsDesktop steps={steps} setSteps={setSteps} />
            <StepsMobile currentStep={currentStep} steps={steps} />
          </div>

          {/* Form */}
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <form
              onSubmit={handleSubmit(async (data: TicketsForm) => {
                console.log("Submitting Ticket Data to mint", data);
                // remove form fields for api call
                const {
                  selectedTicket,
                  preDiscountedTickets,
                  discountedTickets,
                  stripePromotionId,
                  ...updatedUser
                } = formData;
                // save data to local storage
                localStorage.setItem(
                  "savedFormData",
                  JSON.stringify({ selectedTicket, updatedUser })
                );

                setIsLoading(true);
                // Create a Checkout Session.
                const response = await fetchPostJSON("/api/checkout_sessions", {
                  priceId: selectedTicket.stripePriceId,
                  creatorId: event.creatorId,
                  promoId: formData.stripePromotionId,
                  paymentSuccessUrl: `events/register/${event.eventId}?paymentSuccess=true`,
                });

                if (response.statusCode === 500) {
                  console.error(response.message);
                  return;
                }

                // Redirect to Checkout.
                const stripe = await getStripe();
                const { error } = await stripe!.redirectToCheckout({
                  // Make the id field from the Checkout Session creation API response
                  // available to this file, so you can provide it as parameter here
                  // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
                  sessionId: response.id,
                });
                // If `redirectToCheckout` fails due to a browser or network
                // error, display the localized error message to your customer
                // using `error.message`.
                console.warn(error.message);
                setIsLoading(false);
              })}
            >
              {/* Step 1 */}
              {currentStep?.id === "Step 1" &&
                currentStep?.status === StepStatus.CURRENT && (
                  <TicketSelectionFormPage
                    setValue={setValue}
                    watch={watch}
                    proceedStep={proceedStep}
                    isPromoApplied={isPromoApplied}
                    setIsPromoApplied={setIsPromoApplied}
                  />
                )}
              {/* Step 2 */}
              {currentStep?.id === "Step 2" &&
                currentStep?.status === StepStatus.CURRENT && (
                  <ConfirmationPage
                    watch={watch}
                    control={control}
                    trigger={trigger}
                    setIsRegisterSuccessModalOpen={
                      setIsRegisterSuccessModalOpen
                    }
                  />
                )}
            </form>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default FanEventRegister;

// use axios GET method to fetch data
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = session?.user.userId;

  // use axios GET method to fetch data
  const { data: userData } = await axios.get(`${API_URL}/users/${userId}`);

  const { data: event } = await axios.get(
    `${API_URL}/events/${context.params?.id}`
  );

  return {
    props: {
      userData,
      event,
    },
  };
};
