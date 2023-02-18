import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormTrigger,
} from "react-hook-form";
import { FaDollarSign, FaTrash } from "react-icons/fa";
import Button from "../../Button";
import Input from "../../Input";
import InputGroup from "../../InputGroup";
import { Event } from "../../../pages/events/create";

type TicketFormPageProps = {
  control: Control<Event, any>;
  trigger: UseFormTrigger<Event>;
  fields: FieldArrayWithId<Event, "tickets", "id">[];
  addNewTicket: () => void;
  removeTicket: (index: number) => void;
  proceedStep: () => void;
};

const TicketFormPage = ({
  control,
  trigger,
  fields,
  addNewTicket,
  removeTicket,
  proceedStep,
}: TicketFormPageProps) => {
  return (
    <div>
      <section>
        {fields.map((field, index) => (
          <div
            id={`ticket-${index + 1}`}
            key={index} // use id if the field id is unique
            className=""
          >
            {index > 0 && <div className="divider" />}
            <div className="sticky top-0 z-30 flex justify-between bg-sky-100 py-2">
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
            </div>
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
                    value={value?.toString()} // NOTE: native input cannot accept dates need to see how to pass to be
                    onChange={onChange}
                    placeholder="Start Date and Time"
                    size="md"
                    variant="bordered"
                    errorMessage={error?.message}
                    className="max-w-3xl align-middle text-gray-400"
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
                    value={value?.toString()}
                    onChange={onChange}
                    placeholder="End Date and Time"
                    size="md"
                    variant="bordered"
                    errorMessage={error?.message}
                    className="max-w-3xl align-middle text-gray-400"
                  />
                )}
              />

              <div className="text-green-400">
                todo: add ticket type to prisma type
              </div>
              <div className="text-green-400">
                todo: add ticket status to prisma type
              </div>
              <div className="text-green-400">
                todo: add promo code to prisma type - is this binded to event or
                each ticket?
              </div>
            </div>
          </div>
        ))}
      </section>
      <div className="sticky bottom-0 z-30 flex items-center justify-end gap-6 bg-sky-100 py-2 sm:relative">
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
          className="max-w-3xl px-12"
          onClick={async () => {
            const isValidated = await trigger(["tickets"]);

            if (isValidated) {
              proceedStep();
              document
                .getElementById("scrollable")
                ?.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TicketFormPage;
