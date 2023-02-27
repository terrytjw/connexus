import Image from "next/image";
import { useState } from "react";
import { FaImage, FaTrashAlt } from "react-icons/fa";
import { UseFieldArrayRemove, UseFormSetValue } from "react-hook-form";
import Button from "./Button";
import { CreateCollectionForm } from "../pages/merchandise/create";
import { Collectible } from "../utils/types";

type CollectibleInputProps = {
  collectible: Collectible;
  index: number;
  setValue: UseFormSetValue<CreateCollectionForm>;
  remove: UseFieldArrayRemove;
};

const CollectibleInput = ({
  collectible,
  index,
  setValue,
  remove,
}: CollectibleInputProps) => {
  const [imagePreview, setImagePreview] = useState("");

  return (
    <div className="flex items-center justify-center gap-4 rounded-lg border-2 bg-white p-4 lg:max-w-sm">
      <div className="relative flex h-40 w-2/5">
        <input
          type="file"
          className="z-20 h-full w-full cursor-pointer rounded-lg opacity-0"
          accept="image/png, image/gif, image/jpeg, video/mp4"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const reader = new FileReader();
              reader.addEventListener("load", () => {
                setImagePreview(reader.result as string);
                setValue(
                  `collectibles.${index}.image`,
                  reader.result as string
                );
              });
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />
        {imagePreview ? (
          <Image
            fill
            className="absolute aspect-square rounded-lg object-cover object-center"
            src={imagePreview}
            alt={"Collection item image"}
          />
        ) : (
          <div className="input-bordered input absolute flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg text-center text-xs text-gray-500">
            <FaImage size={40} />
            Upload Image
          </div>
        )}
      </div>

      <div className="flex h-full w-3/5 flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex h-10 w-32 flex-grow flex-row">
            <button
              type="button"
              className="w-20 rounded-l bg-gray-200 hover:bg-gray-300"
              onClick={() => {
                if (
                  collectible.totalMerchSupply &&
                  collectible.totalMerchSupply > 1
                ) {
                  setValue(
                    `collectibles.${index}.totalMerchSupply`,
                    collectible.totalMerchSupply - 1
                  );
                  return;
                }
                setValue(`collectibles.${index}.totalMerchSupply`, 1);
              }}
            >
              <span className="m-auto text-2xl">-</span>
            </button>
            <input
              type="number"
              min={1}
              step={1}
              value={collectible.totalMerchSupply}
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
                setValue(
                  `collectibles.${index}.totalMerchSupply`,
                  e.target.valueAsNumber
                );
              }}
              className="w-full flex-shrink appearance-none rounded-none bg-gray-200 text-center outline-none"
            ></input>
            <button
              type="button"
              className="w-20 rounded-r bg-gray-200 hover:bg-gray-300"
              onClick={() => {
                if (collectible.totalMerchSupply) {
                  setValue(
                    `collectibles.${index}.totalMerchSupply`,
                    collectible.totalMerchSupply + 1
                  );
                  return;
                }
                setValue(`collectibles.${index}.totalMerchSupply`, 1);
              }}
            >
              <span className="m-auto text-2xl font-thin">+</span>
            </button>
          </div>
          <Button
            variant="outlined"
            size="sm"
            type="button"
            className="border-0"
            onClick={() => {
              remove(index);
            }}
          >
            <FaTrashAlt />
          </Button>
        </div>
        <input
          className="input-bordered input h-full"
          placeholder="Name"
          onChange={(e) => {
            setValue(`collectibles.${index}.name`, e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default CollectibleInput;
