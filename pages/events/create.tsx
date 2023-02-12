import {
  Control,
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import {
  FaCamera,
  FaChevronLeft,
  FaDollarSign,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import Avatar from "../../components/Avatar";
import Badge from "../../components/Badge";
import Banner from "../../components/Banner";
import Button from "../../components/Button";
import Input from "../../components/Input";
import StepsMobile from "./../../components/StepsMobile";
import StepsDesktop, { Step } from "./../../components/StepsDesktop";

import { Ticket, PrivacyType } from "@prisma/client";
import { useMemo, useState } from "react";
import InputGroup from "../../components/InputGroup";
import { StepStatus } from "../../utils/enums";

// hard coded tag type, will be replaced with prisma type
type Event = {
  name: string;
  description: string;
  bannerPic: File | null;
  profilePic: File | null;
  startDateTime: string;
  endDateTime: string;
  location: string;
  maxAttendees: number;
  tags: string[];
  tickets: Ticket[];
  privacy: PrivacyType;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// hard coded tag types, will be replaced
const labels = [
  "NFT",
  "Lifestyle",
  "Fitness",
  "Entertainment",
  "Fashion",
  "Animals",
  "Travel",
  "Education",
  "Health",
];

// hard coded data
const privacy = [
  {
    id: "public",
    name: "Public",
    description: "description..",
  },
  {
    id: "private",
    name: "Private",
    description: "description..",
  },
];

const publish = [
  {
    id: "now",
    name: "Publish now",
    description: "description..",
  },
  {
    id: "later",
    name: "Schedule for later",
    description: "description..",
  },
];

const CreatorEventCreate = () => {
  // hard default event, will be replaced to match prisma type
  const { handleSubmit, setValue, control, watch, trigger, getValues } =
    useForm<Event>({
      defaultValues: {
        name: "",
        description: "",
        startDateTime: "",
        endDateTime: "",
        location: "",
        tags: [""],
        tickets: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const [bannerPic, profilePic, tags, tickets] = watch([
    "bannerPic",
    "profilePic",
    "tags",
    "tickets",
  ]);
  const [steps, setSteps] = useState<Step[]>([
    { id: "Step 1", name: "Event Details", status: StepStatus.CURRENT },
    { id: "Step 2", name: "Ticket Details", status: StepStatus.UPCOMING },
    { id: "Step 3", name: "Publish Details", status: StepStatus.UPCOMING },
  ]);

  // need to confirm types with sl - should we allow undefined for number type initial?
  // a null/ undefined state is needed for form validation
  const addNewTicket = (): void => {
    append({
      ticketId: 1,
      name: "",
      description: "",
      price: Number.MIN_VALUE,
      quantity: Number.MIN_VALUE,
      startDate: new Date(0),
      endDate: new Date(0),
      eventId: Number.MIN_VALUE,
    });
  };

  const removeTicket = (index: number): void => {
    remove(index);
  };

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
        if (tickets.length === 0) {
          addNewTicket();
        }
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

  const currentStep: Step | undefined = useMemo(
    () => getCurrentStep(),
    [getCurrentStep]
  );

  return (
    <main className="py-12 px-4 sm:px-12">
      {/* Header */}
      <nav className="flex items-center gap-6">
        {currentStep?.id !== "Step 1" && (
          <FaChevronLeft
            className="text-lg text-blue-600 hover:cursor-pointer sm:text-xl"
            onClick={reverseStep}
          />
        )}
        <h2 className="text-2xl font-bold sm:text-4xl">
          {currentStep?.id === "Step 1"
            ? "Create a New Event"
            : currentStep?.id === "Step 2"
            ? "Create New Tickets"
            : "Publish Event"}
        </h2>
      </nav>

      {/* Steps */}
      <div className="justify-cente relative">
        {/* conditionally rendered via css */}
        <StepsDesktop steps={steps} />
        <StepsMobile currentStep={currentStep} steps={steps} />
      </div>

      {/* Form */}
      <div className="">
        <form
          onSubmit={handleSubmit((data: Event) =>
            console.log("Submitting Form Data", data)
          )}
        >
          {/* Step 1 */}
          {currentStep?.id === "Step 1" &&
            currentStep?.status === StepStatus.CURRENT && (
              <EventFormInputs
                labels={labels}
                setValue={setValue}
                control={control}
                trigger={trigger}
                bannerPic={bannerPic}
                profilePic={profilePic}
                tags={tags}
                proceedStep={proceedStep}
              ></EventFormInputs>
            )}
          {/* Step 2 */}
          {currentStep?.id === "Step 2" &&
            currentStep?.status === StepStatus.CURRENT && (
              <TicketFormInputs
                control={control}
                trigger={trigger}
                fields={fields}
                addNewTicket={addNewTicket}
                removeTicket={removeTicket}
                proceedStep={proceedStep}
              ></TicketFormInputs>
            )}
          {/* Step 3 */}
          {currentStep?.id === "Step 3" &&
            currentStep?.status === StepStatus.CURRENT && (
              <PublishFormInputs
                privacy={privacy}
                publish={publish}
              ></PublishFormInputs>
            )}
        </form>
      </div>
    </main>
  );
};

export default CreatorEventCreate;

// Individual form components
type EventFormInputsProps = {
  labels: string[];
  setValue: UseFormSetValue<Event>;
  control: Control<Event, any>;
  trigger: UseFormTrigger<Event>;
  bannerPic: File | null;
  profilePic: File | null;
  tags: string[];
  proceedStep: () => void;
};

const EventFormInputs = ({
  labels,
  setValue,
  control,
  trigger,
  bannerPic,
  profilePic,
  tags,
  proceedStep,
}: EventFormInputsProps) => {
  return (
    <div>
      {/* TODO: abstract out to a form component */}
      <div className="relative h-32 w-full lg:h-48">
        {bannerPic ? (
          <Banner coverImageUrl={URL.createObjectURL(bannerPic)} />
        ) : null}
        <div
          className={classNames(
            "absolute top-0 flex h-32 w-full lg:h-48",
            bannerPic ? "bg-black opacity-60" : "bg-gray-200"
          )}
        ></div>
        <div className="absolute top-0 flex h-32 w-full items-center justify-center gap-6 lg:h-48">
          <label className="relative">
            <Button variant="solid" size="md" className="!btn-circle">
              <FaCamera />
            </Button>
            <input
              type="file"
              className="btn-md btn-circle btn absolute top-0 z-10 cursor-pointer opacity-0"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setValue("bannerPic", e.target.files[0]);
                }
              }}
            />
          </label>
          {bannerPic ? (
            <Button
              variant="solid"
              size="md"
              className="!rounded-full"
              onClick={() => {
                setValue("bannerPic", null);
              }}
            >
              <FaTimes />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="z-10 mx-auto h-24 px-4 sm:h-32 sm:px-6 lg:px-8">
        <div className="relative z-10 -mt-12 h-fit sm:-mt-16">
          {profilePic ? (
            <Avatar imageUrl={URL.createObjectURL(profilePic)} />
          ) : null}
          <div
            className={classNames(
              "absolute top-0 flex h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32",
              profilePic ? "bg-black opacity-60" : "bg-gray-200"
            )}
          ></div>
          <div className="absolute top-0 flex h-24 w-24 items-center justify-center rounded-full ring-4 ring-white sm:h-32 sm:w-32">
            <label className="relative">
              <Button variant="solid" size="md" className="!rounded-full">
                <FaCamera />
              </Button>
              <input
                type="file"
                className="btn-md btn-circle btn absolute top-0 z-10 cursor-pointer opacity-0"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setValue("profilePic", e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col gap-2">
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Event Name is required",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="text"
              label="Event Name"
              value={value}
              onChange={onChange}
              placeholder="Event Name"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{
            required: "Event Description is required",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="form-control w-full max-w-3xl">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="input-group textarea-bordered textarea w-full max-w-3xl bg-white"
                placeholder="Tell us what your event is about"
                value={value}
                onChange={onChange}
              />
              <label className="label">
                <span className="label-text-alt text-red-500">
                  {error?.message}
                </span>
              </label>
            </div>
          )}
        />

        <Controller
          control={control}
          name="startDateTime"
          rules={{
            required: "Start Date and Time is required", // validate: (value) =>
            //   (value = "date type" || "Proper date format is required"),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="datetime-local"
              label="Start Date and Time"
              value={value}
              onChange={onChange}
              placeholder="Start Date and Time"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl align-middle"
            />
          )}
        />

        <Controller
          control={control}
          name="endDateTime"
          rules={{
            required: "End Date and Time is required", // validate: (value) =>
            //   (value = "date type" || "Proper date format is required"),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="datetime-local"
              label="End Date and Time"
              value={value}
              onChange={onChange}
              placeholder="End Date and Time"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl align-middle"
            />
          )}
        />

        <div className="form-control w-full max-w-3xl">
          <label className="label">
            <span className="label-text">Topics of Your Event</span>
          </label>

          <div className="input-bordered input flex h-fit flex-wrap gap-4 bg-white p-4">
            {labels.map((label, index) => {
              return (
                <Badge
                  key={index}
                  size="lg"
                  label={label}
                  selected={
                    tags && tags.length > 0 && tags.indexOf(label) != -1
                  }
                  onClick={() => {
                    if (!tags) {
                      setValue("tags", [label]);
                      return;
                    }

                    if (tags && tags.indexOf(label) == -1) {
                      setValue("tags", [...tags, label]);
                      return;
                    }

                    setValue(
                      "tags",
                      tags?.filter((tag) => {
                        return tag != label;
                      })
                    );
                  }}
                />
              );
            })}
          </div>

          <label className="label">
            <span className="label-text-alt text-red-500">
              {/* Please select at least one topic */}
            </span>
          </label>
        </div>

        <Controller
          control={control}
          name="location"
          rules={{
            required: "Location is required",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="text"
              label="Location (todo: Use Geocoder)"
              value={value}
              onChange={onChange}
              placeholder="Event Name"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
            />
          )}
        />

        <Controller
          control={control}
          name="maxAttendees"
          rules={{
            required: "Maximum Number of Attendees is required",
            validate: (value) =>
              value > 0 || "Minimum Number of Attendees is 1",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="number"
              label="Maximum Number of Attendees"
              value={value}
              onChange={onChange}
              placeholder="Maximum Number of Attendees"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
            />
          )}
        />
        <Button
          variant="solid"
          size="md"
          className="max-w-3xl"
          onClick={async () => {
            const isValidated = await trigger([
              "name",
              "description",
              "startDateTime",
              "endDateTime",
              "location",
              "maxAttendees",
            ]); // todo: add mroe validation
            if (isValidated) {
              proceedStep();
            }
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

type TicketFormInputsProps = {
  control: Control<Event, any>;
  trigger: UseFormTrigger<Event>;
  fields: FieldArrayWithId<Event, "tickets", "id">[];
  addNewTicket: () => void;
  removeTicket: (index: number) => void;
  proceedStep: () => void;
};

const TicketFormInputs = ({
  control,
  trigger,
  fields,
  addNewTicket,
  removeTicket,
  proceedStep,
}: TicketFormInputsProps) => {
  return (
    <div>
      <section>
        {fields.map((field, index) => (
          <div
            key={index} // use id if the field id is unique
            className="pb-12"
          >
            {index > 0 && <div className="divider" />}
            <span className="flex justify-between">
              <h2 className="text-md font-semibold">
                {`Ticket # ${index + 1}: ${field.name}` ||
                  `Add Ticket #${index + 1}`}
              </h2>
              {index > 0 && (
                <FaTrash
                  onClick={() => removeTicket(index)}
                  className="text-lg text-red-400 hover:cursor-pointer"
                />
              )}
            </span>
            <div className="mt-8 flex w-full flex-col gap-2">
              <Controller
                control={control}
                name={`tickets.${index}.name`}
                rules={{
                  required: "Ticket Name is required",
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Input
                    type="text"
                    label="Ticket Name"
                    value={value}
                    onChange={onChange}
                    placeholder="Ticket Name"
                    size="md"
                    variant="bordered"
                    errorMessage={error?.message}
                    className="max-w-3xl"
                  />
                )}
              />
              <Controller
                control={control}
                name={`tickets.${index}.description`}
                rules={{
                  required: "Ticket Description is required",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className="form-control w-full max-w-3xl">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      className="input-group textarea-bordered textarea w-full max-w-3xl bg-white"
                      placeholder="Tell us the perks of owning this ticket"
                      value={value}
                      onChange={onChange}
                    />
                    <label className="label">
                      <span className="label-text-alt text-red-500">
                        {error?.message}
                      </span>
                    </label>
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`tickets.${index}.quantity`}
                rules={{
                  required: "Available quantity is required",
                  validate: (value) => value > 0 || "Minimum quantity is 1",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    type="number"
                    label="Available Quantity"
                    value={value}
                    onChange={onChange}
                    placeholder="Available Quantity"
                    size="md"
                    variant="bordered"
                    errorMessage={error?.message}
                    className="max-w-3xl"
                  />
                )}
              />

              <Controller
                control={control}
                name={`tickets.${index}.price`}
                rules={{
                  required: "Price of ticket is required",
                  validate: (value) =>
                    value > 0 || "Minimum price must be more than 0",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <InputGroup
                    type="number"
                    label="Price"
                    value={value}
                    onChange={onChange}
                    placeholder="Price"
                    size="md"
                    variant="bordered"
                    errorMessage={error?.message}
                    className="max-w-3xl"
                  >
                    <FaDollarSign />
                  </InputGroup>
                )}
              />

              <Controller
                control={control}
                name={`tickets.${index}.startDate`}
                rules={{
                  required: "Start Date and Time is required", // TODO: [validation] ticket start date cannot be > event start date
                  // validate: (value) =>
                  //   (value = "date type" || "Proper date format is required"),
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    type="datetime-local"
                    label="Start Date and Time"
                    value={value.toString()} // NOTE: native input cannot accept dates need to see how to pass to be
                    onChange={onChange}
                    placeholder="Start Date and Time"
                    size="md"
                    variant="bordered"
                    errorMessage={error?.message}
                    className="max-w-3xl align-middle"
                  />
                )}
              />

              <Controller
                control={control}
                name={`tickets.${index}.endDate`}
                rules={{
                  required: "End Date and Time is required", // TODO: [validation] ticket start date cannot be > event start date
                  // validate: (value) =>
                  //   (value = "date type" || "Proper date format is required"),
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    type="datetime-local"
                    label="End Date and Time"
                    value={value.toString()}
                    onChange={onChange}
                    placeholder="End Date and Time"
                    size="md"
                    variant="bordered"
                    errorMessage={error?.message}
                    className="max-w-3xl align-middle"
                  />
                )}
              />

              <div className="text-green-400">
                todo: add ticket status to prisma type
              </div>
              <div className="text-green-400">
                todo: add promo code to prisma type
              </div>
            </div>
          </div>
        ))}
      </section>
      <div className="flex justify-end gap-6">
        <Button
          variant="outlined"
          size="md"
          className="max-w-3xl"
          onClick={async () => {
            const isValidated = await trigger(["tickets"]);

            if (isValidated) {
              addNewTicket();
            }
          }}
        >
          Add a new ticket
        </Button>
        <Button
          variant="solid"
          size="md"
          className="max-w-3xl"
          onClick={async () => {
            const isValidated = await trigger(["tickets"]);

            if (isValidated) {
              proceedStep();
            }
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

type PublishFormInputProps = {
  privacy: {
    id: string;
    name: string;
    description: string;
  }[];
  publish: {
    id: string;
    name: string;
    description: string;
  }[];
};

const PublishFormInputs = ({ privacy, publish }: PublishFormInputProps) => {
  return (
    <div>
      <section>
        <div className="pb-12">
          <div className="text-2xl text-green-400">
            Kindly ignore this page, need to check how data for this is stored
          </div>
          <div className="">
            <h2 className="text-xl font-semibold ">Preview Event Details</h2>
            <div className="text-green-400">todo: add preview link</div>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold ">Who can see your event?</h2>
            <fieldset className="mt-8">
              <div className="space-y-5">
                {privacy.map((privacy) => (
                  <div key={privacy.id} className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={privacy.id}
                        name="privacyType"
                        type="radio"
                        defaultChecked={true}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={privacy.id}
                        className="font-medium text-gray-700"
                      >
                        {privacy.name}
                      </label>
                      <p className="text-gray-500">{privacy.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold ">
              When should we publish your event?
            </h2>
            <fieldset className="mt-8">
              <div className="space-y-5">
                {publish.map((publish) => (
                  <div key={publish.id} className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={publish.id}
                        name="privacyType"
                        type="radio"
                        defaultChecked={true}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={publish.id}
                        className="font-medium text-gray-700"
                      >
                        {publish.name}
                      </label>
                      <p className="text-gray-500">{publish.description}</p>
                      {publish.id === "later" && (
                        <div className="text-green-400">
                          todo: add date input
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </section>
      <div className="flex justify-end gap-6">
        <Button
          variant="solid"
          size="md"
          className="max-w-3xl"
          onClick={() => {
            // validation logic
          }}
        >
          Publish
        </Button>
      </div>
    </div>
  );
};
