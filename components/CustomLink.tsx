import Link from "next/link";
import React from "react";

type CustomLinkProps = {
  href: string;
  openInNewPage?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
};
const CustomLink = ({
  href,
  openInNewPage,
  className,
  onClick,
  children,
}: CustomLinkProps) => {
  return (
    <Link
      href={href}
      className={`inline-flex w-fit items-center transition-all hover:text-gray-400 ${className}`}
      target={openInNewPage ? `_blank` : `_self`}
      rel="noreferrer"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
