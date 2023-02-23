import Image from "next/image";
import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type AvatarProps = {
  imageUrl: string;
  className?: string;
  alt?: string;
};

const Avatar = ({ imageUrl, className, alt }: AvatarProps) => {
  return (
    <div
      className={classNames(
        "relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-white sm:h-32 sm:w-32",
        className ?? ""
      )}
    >
      <Image
        fill
        sizes="(min-width: 640px) 128, 96"
        src={imageUrl}
        alt={alt || "Avatar"}
      />
    </div>
  );
};

export default Avatar;
