import React, { FC } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface InputProps {
  type: "text" | "number";
  label: string;
  value: string | number;
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
}

const Input: FC<InputProps> = ({
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
}) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        className={classNames(
          "input-group input",
          `input-${variant}`,
          `input-${size}`,
          "w-full max-w-xs",
          className ?? ""
        )}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="label">
        <span className="label-text-alt text-red-500">{errorMessage}</span>
      </label>
    </div>
  );
};

export default Input;
