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
  control: Control<Attendee, any>;
  trigger: UseFormTrigger<Attendee>;
  proceedStep: () => void;
};

const ParitcularsFormPage = ({
  control,
  trigger,
  proceedStep,
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

        <div className="sticky bottom-0 z-30 flex items-center bg-sky-100 py-2 sm:relative">
          <Button
            variant="solid"
            size="md"
            className="w-full max-w-3xl"
            onClick={async () => {
              const isValidated = await trigger([
                "firstName",
                "lastName",
                "email",
                "mobileNumber",
              ]); // todo: add mroe validation
              if (isValidated) {
                proceedStep();
                // scroll to top of div container
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
    </div>
  );
};

export default ParitcularsFormPage;
