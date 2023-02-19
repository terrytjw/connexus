import {
  Control,
  UseFormTrigger,
  Controller,
  UseFormWatch,
} from "react-hook-form";
import Button from "../../../Button";
import Input from "../../../Input";

import InputGroup from "../../../InputGroup";
import { Attendee } from "../../../../pages/events/register/[id]";

type ParticularsFormPageProps = {
  watch: UseFormWatch<Attendee>;
  control: Control<Attendee, any>;
  trigger: UseFormTrigger<Attendee>;
  proceedStep: () => void;
};

const ParitcularsFormPage = ({
  watch,
  control,
  trigger,
}: ParticularsFormPageProps) => {
  return (
    <div>
      <div className="flex w-full flex-col gap-2">
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: "First Name is required",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="text"
              label="First Name *"
              value={value}
              onChange={onChange}
              placeholder="First Name"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: "Last Name is required",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="text"
              label="Last Name *"
              value={value}
              onChange={onChange}
              placeholder="Last Name"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
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
            />
          )}
        />
        <Controller
          control={control}
          name="mobileNumber"
          rules={{
            required: "Mobile number is required",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputGroup
              type="text"
              label="Mobile Number *"
              value={value}
              onChange={onChange}
              placeholder="Mobile Number"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
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
            <span className="text-sm font-normal ">1x Ticket</span>
            <span className="text-sm font-normal ">$10</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-md font-medium ">Total</span>
            <span className="text-md font-medium ">$88</span>
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
                "firstName",
                "lastName",
                "email",
                "mobileNumber",
              ]); // todo: add mroe validation
            }}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParitcularsFormPage;
