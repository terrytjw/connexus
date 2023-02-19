import React from "react";

type CommentInputProps = {
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
};

const CommentInput = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  children,
}: CommentInputProps) => {
  return (
    <div className="form-control w-full">
      <div className="input-group input-bordered input input-md h-12 items-center pr-0">
        <b className="min-w-fit">{children}</b>
        <input
          className="input input-md h-11 w-full focus:outline-none"
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default CommentInput;
