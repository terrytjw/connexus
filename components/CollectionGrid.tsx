import React, { FC } from "react";
import Button from "./Button";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type CollectionGridProps = {
  //   products: {}[];
  // decide later
};

const CollectionGrid = ({ products }: CollectionGridProps) => {
  return (
    <div className="mx-auto max-w-7xl overflow-hidden py-0 px-0 sm:py-0 sm:px-0 lg:px-2">
      <div className="gap-y-15 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
        {products.map((product) => (
          <a key={product.id} href={product.href} className="group text-sm">
            <div className="saspect-w-1 aspect-h-1 relative w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-x-0 top-0 flex h-full items-end justify-between overflow-hidden rounded-lg p-4">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                />
                <p className="relative text-lg font-semibold text-white">
                  {product.price}
                </p>
                <Button
                  variant="solid"
                  size="sm"
                  className="relative rounded-full text-lg font-semibold text-white"
                >
                  Buy
                </Button>
              </div>
            </div>
            <h3 className="mt-4 font-medium text-gray-900">{product.name}</h3>
            <p className="italic text-gray-500">{product.availability}</p>
            <p className="mt-2 text-sm text-gray-500">{product.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CollectionGrid;
