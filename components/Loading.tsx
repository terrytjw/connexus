import React from "react";
import Image from "next/image";
import { CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";
const CONNEXUS_BLUE = "#1A7DFF";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

type LoadingProps = {
  color?: string;
};
const Loading = ({ color }: LoadingProps) => {
  return (
    <div
      aria-label="Loading..."
      role="status"
      className="flex h-screen animate-pulse flex-col items-center justify-center bg-sky-100"
    >
      <div className="sweet-loading">
        <HashLoader
          color={CONNEXUS_BLUE}
          loading={true}
          cssOverride={override}
          size={50}
          aria-label="Loading Animation"
          data-testid="loading-animation"
        />
      </div>
      <div className="mt-4">
        <Image
          src={"/images/logo.png"}
          alt="Connexus Logo"
          width={150}
          height={150}
        />
      </div>
    </div>
  );
};

export default Loading;
