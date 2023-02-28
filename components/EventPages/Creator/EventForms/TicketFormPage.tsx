import React from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayUpdate,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import Button from "../../../Button";
import Input from "../../../Input";
import InputGroup from "../../../InputGroup";
import { FaDollarSign, FaTrash } from "react-icons/fa";
import { EventWithTicketsandAddress } from "../../../../utils/types";
import { TicketType } from "@prisma/client";

type TicketFormPageProps = {
  isEdit: boolean;
  watch: UseFormWatch<EventWithTicketsandAddress>;
  control: Control<EventWithTicketsandAddress, any>;
  trigger: UseFormTrigger<EventWithTicketsandAddress>;
  fields: FieldArrayWithId<EventWithTicketsandAddress, "tickets", "id">[];
  update: UseFieldArrayUpdate<EventWithTicketsandAddress, "tickets">;
  addNewTicket: () => void;
  removeTicket: (index: number) => void;
  proceedStep: () => void;
};

const TicketFormPage = ({
  isEdit,
  watch,
  control,
  trigger,
  fields,
  update,
  addNewTicket,
  removeTicket,
  proceedStep,
}: TicketFormPageProps) => {
  // form values
  const { endDate, tickets } = watch();
  // console.log("form tickets -> ", tickets);

  const checkIsEditAndDatePassed = (value: string | Date): boolean => {
    return isEdit && !!(new Date(value) < new Date());
  };
  return (
    <div>
      <section>
        {fields.map((ticket, index) => (
          <div
            id={`ticket-${index + 1}`}
            key={index} // use id if the ticket id is unique
            className=""
          >
            {index > 0 && <div className="divider" />}
            <div className="sticky top-0 z-30 flex justify-between bg-sky-100 py-2">
              <h2 className="text-md font-semibold">
                {`Ticket # ${index + 1}: ${ticket.name}` ||
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
                      value={value ?? ""}
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
                name={`tickets.${index}.totalTicketSupply`}
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
                  required: "Start Date and Time is required",
                  validate: {
                    beforeEventEnd: (value) =>
                      new Date(value) < new Date(endDate) ||
                      "Sale Start Date must be before Event End Date ",
                  },
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
                    disabled={checkIsEditAndDatePassed(value)} // cannot edit if event has already started
                  />
                )}
              />

              <Controller
                control={control}
                name={`tickets.${index}.endDate`}
                rules={{
                  required: "End Date and Time is required", // TODO: [validation] ticket start date cannot be > event start date
                  validate: {
                    beforeEventEnd: (value) =>
                      new Date(value) < new Date(endDate) ||
                      "Sale End Date must be before Event End Date ",
                    afterTicketStart: (value) =>
                      new Date(value) > new Date(tickets[index]?.startDate) ||
                      "Sale End Date must be after Sale Start Date ",
                  },
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

              <fieldset className="mt-4" key={index}>
                <h2 className="mb-4 text-sm font-normal">Ticket Status</h2>
                <div className="space-y-5">
                  {Object.values(TicketType).map((ticketTypeOption) => (
                    <div
                      key={ticketTypeOption}
                      className="relative flex items-start"
                    >
                      <div className="flex h-5 items-center">
                        <input
                          name={`ticketType${index}`}
                          type="radio"
                          value={ticketTypeOption}
                          checked={
                            ticketTypeOption === tickets[index].ticketType
                          }
                          className="radio checked:bg-blue-500"
                          onChange={() => {
                            // console.log("new Ticket ->", {
                            //   ...tickets[index],
                            //   ticketType: ticketTypeOption,
                            // });
                            update(index, {
                              ...tickets[index],
                              ticketType: ticketTypeOption,
                            });
                          }}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor={ticketTypeOption}
                          className="font-medium text-gray-800"
                        >
                          {ticketTypeOption === TicketType.ON_SALE
                            ? "On Sale"
                            : "Pause"}
                        </label>
                        <p className="text-gray-500">
                          {ticketTypeOption === TicketType.ON_SALE
                            ? "Keep selling ticket"
                            : "Pause this ticket sale"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
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
