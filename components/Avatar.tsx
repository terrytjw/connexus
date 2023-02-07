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
    <div className="flex">
      <img
        className={classNames(
          "h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32",
          className ?? ""
        )}
        src={imageUrl}
        alt={alt}
      />
    </div>
  );
};

export default Avatar;
