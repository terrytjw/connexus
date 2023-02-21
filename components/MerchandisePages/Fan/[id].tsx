import Link from "next/link";
import React, { useState } from "react";
import Badge from "../../Badge";
import Button from "../../Button";
import CollectibleGrid from "../../CollectibleGrid";
import { collectibles, collections } from "../../../utils/dummyData";

const FanCollectionPage = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="py-12 px-4 sm:px-12">
      <h1 className="text-3xl font-bold">{collections[0].name}</h1>

      <div className="mt-6">
        <div className="card mb-8 flex justify-between gap-6 border-2 border-gray-200 bg-white p-6">
          <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-xl font-bold text-gray-700">
              {collections[0].name}
            </h1>
            <Badge
              className="h-min"
              size="lg"
              label="Unlocks Premium Channel"
            />
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex flex-col gap-y-4">
              <h2 className="text-gray-700">{collections[0].description}</h2>
              <span className="text-sm text-gray-700">
                Created by{" "}
                <Link
                  href="/user/profile/1"
                  className="font-semibold text-blue-600 underline"
                >
                  {collections[0].creator.displayName}
                </Link>
              </span>
              <span>
                <p className="text-sm text-gray-700">Price</p>
                <p className="text-lg font-semibold text-blue-600">$5</p>
              </span>
            </div>

            <div className="flex items-end gap-4">
              {/* Input Stepper */}
              <div className="flex items-center">
                <div className="flex h-12 w-32 flex-row">
                  {/* decrease button */}
                  <button
                    className="w-20 rounded-l bg-gray-200 hover:bg-gray-300"
                    disabled={quantity == 1}
                    onClick={() => {
                      if (quantity > 1) {
                        setQuantity(quantity - 1);
                        return;
                      }
                      setQuantity(1);
                    }}
                  >
                    <span className="m-auto text-2xl">-</span>
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={collections[0].quantity}
                    step={1}
                    value={quantity}
                    onKeyDown={(e) => {
                      // disallow decimal
                      // only allow numbers, backspace, arrow left and right for editing
                      if (
                        e.code == "Backspace" ||
                        e.code == "ArrowLeft" ||
                        e.code == "ArrowRight" ||
                        (e.key >= "0" && e.key <= "9")
                      ) {
                        return;
                      }
                      e.preventDefault();
                    }}
                    onChange={(e) => {
                      if (e.target.valueAsNumber > collections[0].quantity) {
                        setQuantity(collections[0].quantity);
                        return;
                      }
                      setQuantity(e.target.valueAsNumber);
                    }}
                    className="w-full appearance-none bg-gray-200 text-center outline-none"
                  ></input>
                  {/* increase button */}
                  <button
                    className="w-20 rounded-r bg-gray-200 hover:bg-gray-300"
                    disabled={quantity == collections[0].quantity}
                    onClick={() => {
                      if (quantity) {
                        setQuantity(quantity + 1);
                        return;
                      }
                      setQuantity(1);
                    }}
                  >
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
              </div>
              <Button variant="solid" size="md">
                Buy
              </Button>
            </div>
          </div>
        </div>
        <CollectibleGrid data={collectibles} collectedTab={false} />
      </div>
    </main>
  );
};

export default FanCollectionPage;
