import React from "react";
import { Path, UseFormRegister, UseFormWatch } from "react-hook-form";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type TextAreaProps = {
  className?: string;
  label: string;
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  additionalValidations?: any; // must be an object, see Playground.tsx for implementation details
  errors: any;
  autoFocus?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errorMessage?: string;
};
const TextArea = ({
  className,
  label,
  name,
  placeholder,
  register,
  required,
  additionalValidations,
  errors,
  autoFocus,
  disabled,
  placeholder,
  label,
  value,
  onChange,
  errorMessage,
}: TextAreaProps) => {
  const isRequiredError = errors[name]?.type === "required";

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        className={classNames(
          "textarea-bordered textarea h-32",
          className ?? "",
          classNames("label-text", isRequiredError ? "border-red-500" : "")
        )}
        placeholder={placeholder}
        {...register(name, {
          required,
          ...additionalValidations,
        })}
        autoFocus={autoFocus}
        disabled={disabled}
      />
      {/* <label className="label">
        <span className="label-text-alt text-red-500">{errorMessage}</span>
      </label> */}
    </div>
  );
};

export default TextArea;
