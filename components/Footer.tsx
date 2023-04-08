import Link from "next/link";
import React from "react";
import CustomLink from "./CustomLink";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="footer footer-center bg-gray-200 p-10 text-black">
      {/* <div className="grid grid-flow-col gap-4 font-medium">
        <CustomLink href="#">About us</CustomLink>
        <CustomLink href="#">Contact</CustomLink>
        <CustomLink href="#">T&Cs</CustomLink>
      </div> */}
      <div>
        <Link
          href="/"
          className="block transition-all duration-300 hover:-translate-y-[3px] hover:opacity-90"
        >
          <Image
            src="/svgs/desktop-connexus-logo.svg"
            alt="Connexus logo"
            width={160}
            height={50}
          />
        </Link>
        <p className="p-3 italic">
          Empowering creators to develop authentic relationships with their
          fans.
        </p>
      </div>
      <div>
        <p>Copyright © 2023 | Connexus</p>
      </div>
    </footer>
  );
};

export default Footer;
