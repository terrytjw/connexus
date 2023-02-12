import React from "react";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type BannerProps = {
  coverImageUrl: string;
  className?: string;
  alt?: string;
};

const Banner = ({ coverImageUrl, className, alt }: BannerProps) => {
  return (
    <div>
      <Image
        className={classNames(
          "h-32 w-full object-cover lg:h-48",
          className ?? ""
        )}
        src={coverImageUrl}
        alt={alt || ""}
        width={200}
        height={200}
      />
    </div>
  );
};

export default Banner;
