import Image from "next/image";
import { useState } from "react";
import { FaImage, FaTrashAlt } from "react-icons/fa";
import Button from "./Button";
import Image from "next/image";
import TextArea from "./TextArea";

type Item = {
  image: string;
  description: string;
  quantity: number;
};

type CollectionItemInputProps = {
  item: Item;
  updateItem: Function;
  deleteItem?: React.MouseEventHandler<HTMLButtonElement>;
};

const CollectionItemInput = ({
  item,
  updateItem,
  deleteItem,
}: CollectionItemInputProps) => {
  const [imagePreview, setImagePreview] = useState("");

  return (
    <div className="card flex items-center justify-around gap-6 border-2 border-gray-200 bg-white p-6 lg:card-side">
      <div className="flex h-40 w-40">
        <input
          type="file"
          className="z-20 h-full w-full cursor-pointer rounded-lg opacity-0"
          accept="image/png, image/gif, image/jpeg, video/mp4"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const reader = new FileReader();
              reader.addEventListener("load", () => {
                setImagePreview(reader.result as string);
                updateItem({ ...item, image: reader.result as string });
              });
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />
        {imagePreview ? (
          <Image
            height={160}
            width={160}
            className="absolute aspect-square rounded-lg object-cover object-center"
            src={imagePreview}
            alt={"Collection item image"}
          />
        ) : (
          <div className="input-bordered input absolute flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-lg text-xs text-gray-500">
            <FaImage size={40} />
            Upload Image
          </div>
        )}
      </div>

      <div className="h-40 w-60">
        <textarea
          className="textarea-bordered textarea h-full w-full resize-none"
          placeholder="Description"
          value={item.description}
          onChange={(e) => {
            updateItem({ ...item, description: e.target.value });
          }}
        ></textarea>
        {/* <TextArea
          label="Your bio"
          name="bio"
          placeholder="I am a 22 years old Software Engineer currently based in San Francisco."
          register={register}
          errors={errors}
        /> */}
      </div>

      <div className="flex items-center">
        <div className="flex h-10 w-32 flex-row">
          <button
            className="w-20 rounded-l bg-gray-200 hover:bg-gray-300"
            onClick={() => {
              if (item.quantity && item.quantity > 1) {
                updateItem({ ...item, quantity: item.quantity - 1 });
                return;
              }
              updateItem({ ...item, quantity: 1 });
            }}
          >
            <span className="m-auto text-2xl">-</span>
          </button>
          <input
            type="number"
            min={1}
            step={1}
            value={item.quantity}
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
              updateItem({ ...item, quantity: e.target.valueAsNumber });
            }}
            className="w-full appearance-none rounded-none bg-gray-200 text-center outline-none"
          ></input>
          <button
            className="w-20 rounded-r bg-gray-200 hover:bg-gray-300"
            onClick={() => {
              if (item.quantity) {
                updateItem({ ...item, quantity: item.quantity + 1 });
                return;
              }
              updateItem({ ...item, quantity: 1 });
            }}
          >
            <span className="m-auto text-2xl font-thin">+</span>
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <Button
          variant="outlined"
          size="sm"
          className="border-0"
          onClick={deleteItem}
        >
          <FaTrashAlt />
        </Button>
      </div>
    </div>
  );
};

export default CollectionItemInput;
