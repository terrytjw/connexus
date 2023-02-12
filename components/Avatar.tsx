import React from "react";
import Image from "next/image";

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
    <div className="flex">
      <Image
        className={classNames(
          "h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32",
          className ?? ""
        )}
        src={imageUrl}
        alt={alt || ""}
        width={200}
        height={200}
      />
    </div>
  );
};

export default Avatar;
