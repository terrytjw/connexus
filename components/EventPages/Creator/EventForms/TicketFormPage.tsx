import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetFieldState,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import Button from "../../../Button";
import Input from "../../../Input";
import InputGroup from "../../../InputGroup";
import { FaDollarSign, FaTrash } from "react-icons/fa";
import { EventWithAllDetails } from "../../../../utils/types";
import { TicketType } from "@prisma/client";
import { isValid } from "date-fns";
import { remove } from "lodash";

type TicketFormPageProps = {
  isEdit: boolean;
  watch: UseFormWatch<EventWithAllDetails>;
  setValue: UseFormSetValue<EventWithAllDetails>;
  getFieldState: UseFormGetFieldState<EventWithAllDetails>;
  control: Control<EventWithAllDetails, any>;
  trigger: UseFormTrigger<EventWithAllDetails>;
  fields: FieldArrayWithId<EventWithAllDetails, "tickets", "id">[];
  update: UseFieldArrayUpdate<EventWithAllDetails, "tickets">;
  addNewTicket: () => void;
  removeTicket: (index: number) => void;
  prizesFields: FieldArrayWithId<
    EventWithAllDetails,
    "raffles.0.rafflePrizes",
    "id"
  >[];
  appendPrize: UseFieldArrayAppend<
    EventWithAllDetails,
    "raffles.0.rafflePrizes"
  >;
  removePrize: UseFieldArrayRemove;
  proceedStep: () => void;
};

const TicketFormPage = ({
  isEdit,
  watch,
  setValue,
  getFieldState,
  control,
  trigger,
  fields,
  update,
  addNewTicket,
  removeTicket,
  prizesFields,
  appendPrize,
  removePrize,
  proceedStep,
}: TicketFormPageProps) => {
  // form values
  const { endDate, tickets, promotion, raffles } = watch();

  const checkIsEditAndDatePassed = (value: string | Date): boolean => {
    /**
     * Disable when
     * 1. is in edit page,
     * 2. is not a valid date
     * 3. date has passed
     * */
    return (
      isEdit && isValid(new Date(value)) && !!(new Date(value) < new Date())
    );
  };

  const isRaffleEnabled = (): boolean | undefined => {
    if (raffles.length === 0) {
      return;
    }
    return raffles[0]?.isEnabled;
  };

  const isRaffleActivated = (): boolean | undefined => {
    if (raffles.length === 0) {
      return;
    }
    return raffles[0]?.isActivated;
  };

  const isPromoEnabled = (): boolean | undefined => {
    if (promotion.length === 0) {
      return;
    }
    return promotion[0]?.isEnabled;
  };

  return (
    <div>
      {/* Promo Code */}
      <section>
        <div className="sticky top-0 z-30 flex justify-between bg-sky-100 py-2">
          <p className="text-md font-medium text-slate-500">Promo Code</p>
        </div>
        {/* Radios */}
        <fieldset className="mt-8">
          <div className="space-y-5">
            {/* want promo */}
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  name="promoSelected"
                  type="radio"
                  value={"yes"}
                  checked={isPromoEnabled()}
                  className="radio checked:bg-blue-500"
                  onChange={() => setValue("promotion.0.isEnabled", true)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="promoSelected]"
                  className="font-medium text-gray-800"
                >
                  Include Promo Code
                </label>
                <p className="text-gray-500">
                  Promo Code applies to ALL tickets
                </p>
              </div>
            </div>
            {/* dont want promo */}
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  name="promoSelected"
                  type="radio"
                  value={"no"}
                  checked={!isPromoEnabled()}
                  className="radio checked:bg-blue-500"
                  onChange={() => setValue("promotion.0.isEnabled", false)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="prizeSelected"
                  className="font-medium text-gray-800"
                >
                  Exclude Promo Code
                </label>
                <p className="text-gray-500">No thanks, skip promo code</p>
              </div>
            </div>
          </div>
        </fieldset>

        {isPromoEnabled() && (
          <div className="mt-4 flex w-full flex-col gap-2">
            <Controller
              control={control}
              name={`promotion.0.name`}
              rules={{
                required: "Promo Code is required",
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Promotion Code"
                  value={value}
                  onChange={onChange}
                  placeholder="Promo Code"
                  size="md"
                  variant="bordered"
                  errorMessage={error?.message}
                  className="max-w-3xl"
                />
              )}
            />
            <Controller
              control={control}
              name={`promotion.0.promotionValue`}
              rules={{
                required: "Discount amount is required",
                validate: {
                  moreThanZero: (value) =>
                    value > 0 || "Discount amount cannot be less than 0",
                  lessThanHundred: (value) =>
                    value <= 100 || "Discount amount cannot be more than 100",
                },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  type="number"
                  label="Discount Amount (%)"
                  value={value}
                  onChange={onChange}
                  placeholder="Discount Amount"
                  size="md"
                  variant="bordered"
                  errorMessage={error?.message}
                  className="max-w-3xl"
                  disabled={isEdit}
                />
              )}
            />
          </div>
        )}
        <div className="divider"></div>
      </section>
      {/* Raffle Prizes */}
      <section>
        <div className="sticky top-0 z-30 flex justify-between bg-sky-100 py-2">
          <p className="text-md font-medium text-slate-500">Raffle</p>
        </div>

        {/* Radios */}
        {!isRaffleActivated() && (
          <fieldset className="mt-8">
            <div className="space-y-5">
              {/* want raffle */}
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    name="prizeSelected"
                    type="radio"
                    value={"yes"}
                    checked={isRaffleEnabled()}
                    className="radio checked:bg-blue-500"
                    onChange={() => {
                      setValue("raffles.0.isEnabled", true);
                    }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="prizeSelected"
                    className="font-medium text-gray-800"
                  >
                    Include Raffle
                  </label>
                  <p className="text-gray-500">Raffle applies to ALL tickets</p>
                </div>
              </div>
              {/* dont want raffle */}
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    name="prizeSelected"
                    type="radio"
                    value={"no"}
                    checked={!isRaffleEnabled()}
                    className="radio checked:bg-blue-500"
                    onChange={() => {
                      setValue("raffles.0.isEnabled", false);
                    }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="prizeSelected"
                    className="font-medium text-gray-800"
                  >
                    Exclude Raffle
                  </label>
                  <p className="text-gray-500">No thanks, skip Raffle</p>
                </div>
              </div>
            </div>
          </fieldset>
        )}

        {/* Prize Inputs */}
        {isRaffleEnabled() && (
          <div>
            <div className="mt-8 flex w-full flex-col gap-2">
              {prizesFields.map((prize, index) => (
                <div
                  id={`prize-${index + 1}`}
                  key={prize.id}
                  className="flex justify-between gap-4"
                >
                  <Controller
                    control={control}
                    name={`raffles.0.rafflePrizes.${index}.name`}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        type="text"
                        label={`Prize ${index + 1} Name`}
                        value={value}
                        onChange={onChange}
                        placeholder="Prize Name"
                        size="md"
                        variant="bordered"
                        errorMessage={error?.message}
                        className="max-w-3xl"
                        disabled={isRaffleActivated()}
                      />
                    )}
                  />
                  {index > 0 && !isRaffleActivated() && (
                    <FaTrash
                      onClick={() => {
                        removePrize(index);
                      }}
                      className="relative top-12 text-lg text-red-400 hover:cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>
            {!isRaffleActivated() && (
              <div className="flex justify-end py-2">
                <Button
                  variant="outlined"
                  size="md"
                  className="max-w-3xl"
                  onClick={(e) => {
                    e.preventDefault();
                    appendPrize({
                      name: "",
                      rafflesId: raffles[0]?.raffleId, // undefined when creating, have id when updating
                      rafflePrizeId: undefined as unknown as number,
                    });
                  }}
                >
                  Add a new prize
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="divider"></div>
      </section>
      {/* Tickets */}
      <section>
        {fields.map((ticket, index) => (
          <div
            id={`ticket-${index + 1}`}
            key={ticket.id} // must be unique
          >
            {index > 0 && <div className="divider" />}
            <div className="sticky top-0 z-30 flex justify-between bg-sky-100 py-2">
              <p className="text-md font-medium text-slate-500">
                {`Ticket #${index + 1}: ${ticket.name}` ||
                  `Add Ticket #${index + 1}`}
              </p>
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
                  validate: {
                    moreThanOne: (value) =>
                      value > 0 || "Minimum quantity is 1",
                  },
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
                    afterNow: (value) =>
                      !getFieldState(`tickets.${index}.startDate`).isDirty && // field not modified
                      checkIsEditAndDatePassed(value) // edit mode and date has passed
                        ? true
                        : new Date(value) > new Date() ||
                          "Start Date must be later than now",
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    type="datetime-local"
                    label="Start Date and Time"
                    value={value?.toString()}
                    onChange={onChange}
                    placeholder="Start Date and Time"
                    size="md"
                    variant="bordered"
                    errorMessage={error?.message}
                    className="max-w-3xl align-middle text-gray-400"
                    disabled={
                      !getFieldState(`tickets.${index}.startDate`).isDirty && // field not modified
                      checkIsEditAndDatePassed(value) // date passed
                    }
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
