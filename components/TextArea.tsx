import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type TextAreaProps = {
  className?: string;
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
  autoFocus,
  disabled,
  placeholder,
  label,
  value,
  onChange,
  errorMessage,
}: TextAreaProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        className={classNames(
          "textarea-bordered textarea h-32",
          className ?? ""
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        disabled={disabled}
      ></textarea>
      <label className="label">
        <span className="label-text-alt text-red-500">{errorMessage}</span>
      </label>
    </div>
  );
};

export default TextArea;
