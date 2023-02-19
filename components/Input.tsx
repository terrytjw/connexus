import React from "react";
import { Path, UseFormRegister, UseFormWatch } from "react-hook-form";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type InputProps = {
  type: "text" | "number" | "date" | "datetime-local" | "email" | "password";
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
};

const Input = ({
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
}: InputProps) => {
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
      <input
        className={classNames(
          "input-group input w-full",
          `input-${variant}`,
          `input-${size}`,
          "w-full",
          "items-center",
          className ?? ""
        )}
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required,
          ...additionalValidations,
        })}
        disabled={disabled}
      />
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

export default Input;
