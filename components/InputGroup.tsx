import React from "react";
import { Path, UseFormRegister, UseFormWatch } from "react-hook-form";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type InputGroupProps = {
  className?: string;
  type: "text" | "number";
  label: string;
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  additionalValidations?: any; // must be an object, see Playground.tsx for implementation details
  errors: any;
  disabled?: boolean;
  size: "xs" | "sm" | "md" | "lg";
  variant:
    | "bordered"
    | "primary"
    | "secondary"
    | "ghost"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  children: React.ReactNode; // icon, symbol, etc. to be displayed on the left side of the input
};

const InputGroup = ({
  className,
  type,
  label,
  name,
  placeholder,
  register,
  required,
  additionalValidations,
  errors,
  disabled,
  size,
  variant,
  children,
}: InputGroupProps) => {
  const isRequiredError = errors[name]?.type === "required";

  return (
    <div className="form-control w-full">
      <label className="label">
        <span
          className={classNames(
            "label-text",
            isRequiredError ? "text-red-500" : ""
          )}
        >
          {label}
        </span>
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div
          className={classNames(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          )}
        >
          {children}
        </div>

        <input
          className={classNames(
            "input block w-full rounded-md pl-10",
            `input-${variant}`,
            `input-${size}`,
            className ?? "",
            classNames("label-text", isRequiredError ? "border-red-500" : "")
          )}
          type={type}
          placeholder={placeholder}
          {...register(name, {
            required,
            ...additionalValidations,
          })}
          disabled={disabled}
        />
      </div>
      {/* { [condition] && (
        <label className="label">
          <span className="label-text-alt text-red-500">
            I am an error message.
          </span>
        </label>
      )} */}
    </div>
  );
};

export default InputGroup;
