import React, { FC } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface BannerProps {
  coverImageUrl: string;
  className?: string;
  alt?: string;
}

const Banner: FC<BannerProps> = ({ coverImageUrl, className, alt }) => {
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
