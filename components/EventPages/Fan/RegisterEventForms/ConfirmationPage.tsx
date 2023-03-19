import {
  Control,
  UseFormTrigger,
  Controller,
  UseFormWatch,
} from "react-hook-form";
import Button from "../../../Button";
import Input from "../../../Input";
import InputGroup from "../../../InputGroup";
import { TicketsForm } from "../../../../pages/events/register/[id]";
// @ts-ignore
import { isEmail, isMobilePhone } from "validator";
import useSWR from "swr";
import { swrFetcher } from "../../../../lib/swrFetcher";

type ConfirmationFormProps = {
  watch: UseFormWatch<TicketsForm>;
  control: Control<TicketsForm, any>;
  trigger: UseFormTrigger<TicketsForm>;
  setIsRegisterSuccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConfirmationFormProps = ({
  watch,
  control,
  trigger,
  setIsRegisterSuccessModalOpen,
}: ConfirmationFormProps) => {
  const { userId } = watch();

  const {
    selectedTicket: { ticketName, qty, price },
  } = watch();

  const { data: userData } = useSWR(
    `http://localhost:3000/api/users/${userId}`,
    swrFetcher
  );

  return (
    <div>
      <div className="flex w-full flex-col gap-2">
        <Controller
          control={control}
          name="displayName"
          rules={{
            required: "Name is required",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="text"
              label="First Name *"
              value={value ?? ""}
              onChange={onChange}
              placeholder="First Name"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
              disabled={!!userData?.displayName}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            validate: {
              validEmail: (value) =>
                isEmail(value) || "Please enter a valid Email",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="text"
              label="Email *"
              value={value}
              onChange={onChange}
              placeholder="Email"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
              disabled={!!userData?.email}
            />
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: "Mobile number is required",
            validate: {
              validMobile: (value) =>
                isMobilePhone(value, "en-SG") ||
                "Please enter a valid SG mobile number",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputGroup
              type="text"
              label="Mobile Number *"
              value={value ?? ""}
              onChange={onChange}
              placeholder="Mobile Number"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
              disabled={!!userData?.phoneNumber}
            >
              <span className="text-xs text-gray-400">+65</span>
            </InputGroup>
          )}
        />

        <div className="divider" />

        {/* TODO: code ticket logic out  */}
        <div className="flex flex-col pb-4 sm:pb-8">
          <h2 className="text-xl font-semibold ">Order Summary</h2>
          <div className="flex flex-row justify-between py-4 sm:py-6">
            <span className="text-sm font-normal ">
              {qty}x {ticketName}
            </span>
            <span className="text-sm font-normal ">${price?.toFixed(2)}</span>
          </div>
          <div className="flex flex-row justify-between">
            {/* only one selected ticket hence total price will be that */}
            <span className="text-md font-medium ">Total</span>
            <span className="text-md font-medium ">${price?.toFixed(2)}</span>
          </div>
        </div>

        <div className="sticky bottom-0 z-30 flex items-center justify-end gap-6 bg-sky-100 py-2 sm:relative">
          <Button
            variant="solid"
            size="md"
            className="max-w-3xl"
            onClick={async () => {
              // validation logic
              const isValidated = await trigger([
                "displayName",
                "email",
                "phoneNumber",
              ]); // todo: add mroe validation

              if (isValidated) {
                setIsRegisterSuccessModalOpen(true);
              }
            }}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationFormProps;
