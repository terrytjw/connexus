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
    <div
      className={classNames("relative h-32 w-full lg:h-48", className ?? "")}
    >
      <Image
        fill
        sizes="100vw"
        className="object-cover"
        src={coverImageUrl}
        alt={alt || "Banner"}
      />
    </div>
  );
};

export default Banner;
