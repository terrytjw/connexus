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
      <img
        className={classNames(
          "h-32 w-full object-cover lg:h-48",
          className ?? ""
        )}
        src={coverImageUrl}
        alt={alt}
      />
    </div>
  );
};

export default Banner;
