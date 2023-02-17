import Image from "next/image";
import React from "react";

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
        height={128}
        width={1400}
        className={classNames(
          "h-32 w-full object-cover lg:h-48",
          className ?? ""
        )}
        src={coverImageUrl}
        alt={alt || "Banner"}
      />
    </div>
  );
};

export default Banner;
