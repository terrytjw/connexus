function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type BadgeProps = {
  className?: string;
  size: "sm" | "md" | "lg";
  label: string;
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const Badge = ({ className, size, label, selected, onClick }: BadgeProps) => {
  if (onClick) {
    return (
      <button
        className={classNames(
          "badge badge-outline rounded-full",
          selected ? "bg-blue-600 text-white" : "text-blue-600",
          `badge-${size}`,
          className ?? ""
        )}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }

  return (
    <span
      className={classNames(
        "badge border-0 bg-blue-600",
        `badge-${size}`,
        className ?? ""
      )}
    >
      {label}
    </span>
  );
};

export default Badge;
