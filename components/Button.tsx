import Link from "next/link";
import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type ButtonProps = {
  className?: string;
  type?: "submit" | "reset";
  href?: string;
  variant: "solid" | "outlined";
  size: "sm" | "md";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
};
const Button = ({
  className,
  href,
  variant,
  size,
  onClick,
  children,
  disabled,
}: ButtonProps) => {
  if (href) {
    return (
      <Link
        href={href}
        className={classNames(
          "btn flex gap-x-2",
          variant === "solid"
            ? "border-white/0 bg-blue-600 text-white hover:border-white/0 hover:bg-blue-700"
            : "btn-outline text-blue-600 hover:border-white/0 hover:bg-blue-600",
          `btn-${size}`,
          "rounded-md normal-case",
          className ?? ""
        )}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={classNames(
        "btn flex gap-x-2",
        variant === "solid"
          ? "border-white/0 bg-blue-600 text-white hover:border-white/0 hover:bg-blue-700"
          : "btn-outline text-blue-600 hover:border-white/0 hover:bg-blue-600",
        `btn-${size}`,
        "rounded-md normal-case",
        className ?? ""
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
