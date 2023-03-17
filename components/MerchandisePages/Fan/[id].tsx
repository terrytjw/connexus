import { Merchandise } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import Badge from "../../Badge";
import Button from "../../Button";
import CollectibleGrid from "../../CollectibleGrid";
import { CollectionWithMerchAndPremiumChannel } from "../../../lib/api-helpers/collection-api";

type FanCollectionPageProps = {
  collection: CollectionWithMerchAndPremiumChannel;
};

const FanCollectionPage = ({ collection }: FanCollectionPageProps) => {
  const maxQuantity = collection.merchandise.reduce(
    (total: number, m: Merchandise) =>
      total + m.totalMerchSupply - m.currMerchSupply,
    0
  );
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="py-12 px-4 sm:px-12">
      <div className="mb-8 flex items-center gap-4">
        <Button
          className="border-0"
          variant="outlined"
          size="md"
          onClick={() => history.back()}
        >
          <FaChevronLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{collection.collectionName}</h1>
          <p className="mt-4 text-red-500">
            Note: Upon purchasing a collectible, it is randomised from the
            collection.
          </p>
        </div>
      </div>

      <div className="mt-6 lg:ml-16">
        <div className="card mb-4 flex justify-between gap-6 border-2 border-gray-200 bg-white p-6">
          <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="mb-2 text-gray-700">{collection.description}</h2>
              <span className="text-sm text-gray-700">
                Created by{" "}
                <Link
                  href={`/user/profile/${collection.creatorId}`}
                  className="font-semibold text-blue-600 underline"
                >
                  {collection.creator.username}
                </Link>
              </span>
            </div>

            {collection.premiumChannel ? (
              <Badge
                className="h-min !bg-blue-100 !text-blue-500"
                size="lg"
                label={`Unlocks ${collection.premiumChannel?.name}`}
              />
            ) : null}
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex flex-col gap-y-4">
              <span>
                <p className="text-sm text-gray-700">Price</p>
                <p className="text-lg font-semibold text-blue-600">
                  ${collection.fixedPrice}
                </p>
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
                    max={maxQuantity}
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
                      if (e.target.valueAsNumber > maxQuantity) {
                        setQuantity(maxQuantity);
                        return;
                      }
                      setQuantity(e.target.valueAsNumber);
                    }}
                    onBlur={(e) => {
                      if (e.target.value == "") {
                        setQuantity(1);
                      }
                    }}
                    className="w-full appearance-none bg-gray-200 text-center outline-none"
                  ></input>
                  {/* increase button */}
                  <button
                    className="w-20 rounded-r bg-gray-200 hover:bg-gray-300"
                    disabled={quantity == maxQuantity}
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
        <CollectibleGrid data={collection.merchandise} collectedTab={false} />
      </div>
    </main>
  );
};

export default FanCollectionPage;
