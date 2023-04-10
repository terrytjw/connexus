import React from "react";
import { Card } from "./ProductCard";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type DesktopProductCardProps = {
  card: Card;
};
const DesktopProductCard = ({ card }: DesktopProductCardProps) => {
  return (
    <div className="mx-auto flex h-96 w-96 flex-col items-center gap-y-8 bg-white p-6 shadow-lg">
      <div className="inline-block rounded-xl bg-blue-500 p-4">
        <card.icon
          className={classNames("h-8 w-8 text-white", "lg:h-12 lg:w-12")}
        />
      </div>
      <p className="mt-4 text-center lg:text-lg">{card.description}</p>
      <p className="mt-auto mb-12 text-center font-semibold text-blue-500 lg:text-lg">
        {card.title}
      </p>
    </div>
  );
};

export default DesktopProductCard;
