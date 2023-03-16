import Image from "next/image";
import { FaImage, FaTrashAlt } from "react-icons/fa";
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import Button from "./Button";
import { CreateCollectionForm } from "../pages/merchandise/create";
import { CreateChannelForm } from "../pages/communities/[id]/channels/create";

type CollectibleInputProps = {
  control: Control<any, any>; // type error when using Control<CreateCollectionForm | CreateCollectionForm, any>
  watch: UseFormWatch<any>;
  trigger: UseFormTrigger<any>;
  setValue: UseFormSetValue<any>;
  fields: FieldArrayWithId<
    CreateCollectionForm | CreateChannelForm,
    "collectibles",
    "id"
  >[];
  errors: FieldErrors<CreateCollectionForm | CreateChannelForm>;
  addNewCollectible: () => void;
  remove: UseFieldArrayRemove;
};

const CollectibleInput = ({
  control,
  watch,
  trigger,
  setValue,
  fields,
  errors,
  addNewCollectible,
  remove,
}: CollectibleInputProps) => {
  const { collectibles } = watch();

  return (
    <section className="mt-8 flex w-full flex-row flex-wrap gap-4 sm:flex-col">
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <label className="label pl-0">
            <span className="label-text">Upload Files*</span>
          </label>
          <p className="label-text">Supported file formats: JPEG, GIF, MP4</p>
        </div>

        <Button
          className="w-full sm:w-fit"
          variant="solid"
          size="sm"
          type="button"
          onClick={async () => {
            const isValidated = await trigger(["collectibles"]);

            if (isValidated) {
              addNewCollectible();
            }
          }}
        >
          Add item
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-y-6 gap-x-6 lg:grid-cols-2">
        {fields.map((field, index) => (
          <div className="flex flex-col" key={field.id}>
            <div className="flex items-center justify-center gap-4 rounded-lg border-2 bg-white p-4 lg:max-w-sm">
              <Controller
                control={control}
                name={`collectibles.${index}.image`}
                rules={{
                  required: "Collectible Image is required",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className="relative flex h-40 w-2/5">
                    <input
                      type="file"
                      className="z-20 h-full w-full cursor-pointer rounded-lg opacity-0"
                      accept="image/png, image/gif, image/jpeg, video/mp4"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.addEventListener("load", () => {
                            setValue(
                              `collectibles.${index}.image`,
                              reader.result as string
                            );
                          });
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                    {collectibles[index].image ? (
                      <Image
                        fill
                        className="absolute aspect-square rounded-lg object-cover object-center"
                        src={collectibles[index].image}
                        alt={"Collection item image"}
                      />
                    ) : (
                      <div className="input-bordered input absolute flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg text-center text-xs text-gray-500">
                        <FaImage size={40} />
                        Upload Image
                      </div>
                    )}
                  </div>
                )}
              />

              <div className="flex h-full w-3/5 flex-col gap-4">
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex h-10 w-32 flex-grow flex-row">
                    <button
                      type="button"
                      className="w-20 rounded-l bg-gray-200 hover:bg-gray-300"
                      onClick={() => {
                        if (
                          collectibles[index].totalMerchSupply &&
                          collectibles[index].totalMerchSupply > 1
                        ) {
                          setValue(
                            `collectibles.${index}.totalMerchSupply`,
                            collectibles[index].totalMerchSupply - 1
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
                      value={collectibles[index].totalMerchSupply}
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
                        if (collectibles[index].totalMerchSupply) {
                          setValue(
                            `collectibles.${index}.totalMerchSupply`,
                            collectibles[index].totalMerchSupply + 1
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
                      if (collectibles.length > 1) {
                        remove(index);
                      }
                    }}
                  >
                    <FaTrashAlt />
                  </Button>
                </div>

                <Controller
                  control={control}
                  name={`collectibles.${index}.name`}
                  rules={{
                    required: "Collectible Name is required",
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <input
                      className="input-bordered input h-full"
                      placeholder="Name"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
            </div>
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.collectibles && errors.collectibles[index]?.image
                  ? "Collectible Image is required, "
                  : ""}
                {errors.collectibles && errors.collectibles[index]?.name
                  ? "Collectible Name is required"
                  : ""}
              </span>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectibleInput;
