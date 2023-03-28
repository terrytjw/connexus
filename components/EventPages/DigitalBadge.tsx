import Image from "next/image";
import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type DigitalBadgeProps = {
  imageUrl: string;
  className?: string;
  alt?: string;
};

const DigitalBadge = ({ imageUrl, className, alt }: DigitalBadgeProps) => {
  return (
    <div className={classNames("", className ?? "")}>
      <Image
        height={200}
        width={200}
        sizes="100vw"
        className="object-cover"
        src={imageUrl}
        alt={alt || "Digital Badge"}
      />
    </div>
  );
};

export default DigitalBadge;
