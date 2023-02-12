import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type InputGroupProps = {
  type: "text" | "number" | "date" | "datetime-local";
  label: string;
  value: string | number | Date;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errorMessage?: string;
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
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const InputGroup = ({
  type,
  label,
  value,
  onChange,
  placeholder,
  errorMessage,
  size,
  variant,
  disabled,
  className,
  children,
}: InputGroupProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {children}
        </div>

        <input
          className={classNames(
            "input block w-full rounded-md pl-10",
            `input-${variant}`,
            `input-${size}`,
            `items-center bg-white`,
            className ?? ""
          )}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
      <label className="label">
        <span className="label-text-alt text-red-500">{errorMessage}</span>
      </label>
    </div>
  );
};

export default InputGroup;
