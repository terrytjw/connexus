import React from "react";
import Image from "next/image";
import { CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const CONNEXUS_BLUE = "#1A7DFF";

type LoadingProps = {
  color?: string;
  className?: string;
};
const Loading = ({ color = CONNEXUS_BLUE, className }: LoadingProps) => {
  return (
    <div
      aria-label="Loading..."
      role="status"
      className={classNames(
        "flex h-screen animate-pulse flex-col items-center justify-center bg-sky-100",
        className ?? ""
      )}
    >
      <div className="sweet-loading">
        <HashLoader
          color={color}
          loading={true}
          cssOverride={override}
          size={50}
          aria-label="Loading Animation"
          data-testid="loading-animation"
        />
      </div>
      <div className="mt-4">
        <Image
          src={"/svgs/desktop-connexus-logo.svg"}
          alt="Connexus Logo"
          width={150}
          height={150}
        />
      </div>
    </div>
  );
};

export default Loading;
