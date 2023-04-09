import { CollectionState, Merchandise } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import Badge from "../../Badge";
import Button from "../../Button";
import CollectibleGrid from "../../CollectibleGrid";
import Modal from "../../Modal";
import Loading from "../../Loading";
import {
  CollectionWithMerchAndPremiumChannel,
  mintMerchandise,
} from "../../../lib/api-helpers/collection-api";
import { joinChannelAPI } from "../../../lib/api-helpers/channel-api";
import getStripe from "../../../lib/stripe";
import { fetchPostJSON } from "../../../lib/stripe/api-helpers";
import { UserWithAllInfo } from "../../../pages/api/users/[userId]";

type FanCollectionPageProps = {
  userData: UserWithAllInfo;
  collection: CollectionWithMerchAndPremiumChannel;
};

const FanCollectionPage = ({
  userData,
  collection,
}: FanCollectionPageProps) => {
  const maxQuantity = collection.merchandise.reduce(
    (total: number, m: Merchandise) =>
      total + m.totalMerchSupply - m.currMerchSupply,
    0
  );
  const router = useRouter();
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const payForMerchandise = async () => {
    setLoading(true);

    const merchandise = collection.merchandise.filter(
      (m) => m.currMerchSupply < m.totalMerchSupply
    );

    const merchandiseToMint =
      merchandise[Math.floor(Math.random() * merchandise.length)];

    localStorage.setItem(
      "merchandiseToMint",
      JSON.stringify(merchandiseToMint)
    );

    // Create a Checkout Session.
    const response = await fetchPostJSON("/api/checkout_sessions", {
      priceId: merchandiseToMint.stripePriceId,
      creatorId: collection.creatorId,
      paymentSuccessUrl: `${router.asPath}?paymentSuccess=true`,
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
  };

  useEffect(() => {
    const purchaseMerchandise = async () => {
      setLoading(true);
      setIsModalOpen(true);

      // call api to mint merchandise
      const merchandiseToMint: Merchandise = localStorage.getItem(
        "merchandiseToMint"
      )
        ? JSON.parse(localStorage.getItem("merchandiseToMint")!)
        : null;

      await mintMerchandise(
        userData.walletAddress,
        userData.userId,
        merchandiseToMint,
        collection.scAddress
      );

      // if user is member of community, add user as member of premium channel
      if (
        collection.premiumChannel &&
        userData.joinedCommunities.findIndex(
          (community) =>
            collection.premiumChannel?.communityId === community.communityId
        ) !== -1
      ) {
        await joinChannelAPI(
          collection.premiumChannel.channelId,
          userData.userId
        );
      }

      setLoading(false);
    };

    if (router.query.paymentSuccess) {
      purchaseMerchandise();
    }
  }, []);

  return (
    <main className="py-12 px-4 sm:px-12">
      <Modal isOpen={isModalOpen} setIsOpen={() => {}}>
        {loading ? (
          <Loading className="!h-full" />
        ) : (
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Purchase Completed!
            </h3>

            <p className="text-gray-500">
              {localStorage.getItem("merchandiseToMint") ? (
                <>
                  {localStorage.getItem("communityUrl")
                    ? `You have successfully purchased ${
                        JSON.parse(localStorage.getItem("merchandiseToMint")!)
                          .name
                      } from ${
                        collection.premiumChannel?.name
                      }! See the tabs in the community page you joined.`
                    : `You have successfully purchased ${
                        JSON.parse(localStorage.getItem("merchandiseToMint")!)
                          .name
                      } from ${collection.collectionName}! ${
                        collection.premiumChannel
                          ? `You are in for ${collection.premiumChannel.name}!`
                          : ""
                      }`}
                </>
              ) : null}
            </p>

            <div className="flex gap-4">
              <Button
                variant="solid"
                size="md"
                onClick={() => {
                  router.push(
                    localStorage.getItem("communityUrl") ?? "/merchandise"
                  );
                  localStorage.removeItem("merchandiseToMint");
                  localStorage.removeItem("communityUrl");
                }}
              >
                Got it, thanks!
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <div className="mb-8 flex items-center gap-4">
        <Button
          className="border-0"
          variant="outlined"
          size="md"
          href={localStorage.getItem("communityUrl") ?? "/merchandise"}
        >
          <FaChevronLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {collection.collectionName}
          </h1>
          <p className="mt-4 text-red-500">
            Note: Upon purchasing a collectible, it is randomised from the
            collection.
          </p>
        </div>
      </div>

      <div className="mt-6 lg:ml-16">
        <div className="card mb-8 flex justify-between gap-6 border-2 drop-shadow-sm border-gray-200 bg-white p-6">
          <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="mb-2 text-gray-700">{collection.description}</h2>
              <span className="text-sm text-gray-700">
                Created by{" "}
                <Link
                  href={`/user/profile/${collection.creatorId}`}
                  className="font-semibold text-blue-600 underline"
                >
                  {collection.creator.username}
                </Link>
              </span>
            </div>

            {collection.premiumChannel ? (
              <Badge
                className="h-min !bg-blue-100 !text-blue-600"
                size="lg"
                label={`Unlocks ${collection.premiumChannel?.name}`}
              />
            ) : null}
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex flex-col gap-y-4">
              <span>
                <p className="text-sm text-gray-700">Price</p>
                <p className="text-lg font-semibold text-blue-600">
                  ${collection.fixedPrice}
                </p>
              </span>
            </div>

            {collection.collectionState !== CollectionState.SOLD &&
            collection.merchandise.reduce(
              (total: number, m: Merchandise) =>
                total + m.totalMerchSupply - m.currMerchSupply,
              0
            ) > 0 ? (
              <div className="flex items-end gap-4">
                {/* Input Stepper */}
                <div className="flex items-center">
                  <div className="flex h-12 w-32 flex-row">
                    {/* decrease button */}
                    <button
                      className="w-20 rounded-l bg-gray-200 hover:bg-gray-300"
                      disabled={quantity == 1}
                      // onClick={() => {
                      //   if (quantity > 1) {
                      //     setQuantity(quantity - 1);
                      //     return;
                      //   }
                      //   setQuantity(1);
                      // }}
                    >
                      <span className="m-auto text-2xl">-</span>
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={maxQuantity}
                      step={1}
                      value={quantity}
                      // onKeyDown={(e) => {
                      //   // disallow decimal
                      //   // only allow numbers, backspace, arrow left and right for editing
                      //   if (
                      //     e.code == "Backspace" ||
                      //     e.code == "ArrowLeft" ||
                      //     e.code == "ArrowRight" ||
                      //     (e.key >= "0" && e.key <= "9")
                      //   ) {
                      //     return;
                      //   }
                      //   e.preventDefault();
                      // }}
                      // onChange={(e) => {
                      //   if (e.target.valueAsNumber > maxQuantity) {
                      //     setQuantity(maxQuantity);
                      //     return;
                      //   }
                      //   setQuantity(e.target.valueAsNumber);
                      // }}
                      // onBlur={(e) => {
                      //   if (e.target.value == "") {
                      //     setQuantity(1);
                      //   }
                      // }}
                      className="w-full appearance-none bg-gray-200 text-center outline-none"
                    ></input>
                    {/* increase button */}
                    <button
                      className="w-20 rounded-r bg-gray-200 hover:bg-gray-300"
                      disabled={quantity == maxQuantity}
                      // onClick={() => {
                      //   if (quantity) {
                      //     setQuantity(quantity + 1);
                      //     return;
                      //   }
                      //   setQuantity(1);
                      // }}
                    >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>
                </div>
                <Button
                  variant="solid"
                  size="md"
                  onClick={() => payForMerchandise()}
                >
                  Buy
                </Button>
              </div>
            ) : (
              <Button disabled variant="solid" size="md">
                Sold
              </Button>
            )}
          </div>
        </div>
        <CollectibleGrid data={collection.merchandise} collectedTab={false} />
      </div>
    </main>
  );
};

export default FanCollectionPage;
