import React from "react";
import Head from "next/head";
import Button from "../../components/Button";
import CollectibleInput from "../../components/CollectibleInput";
import { Collectible } from "../../utils/types";
import Input from "../../components/Input";
import InputGroup from "../../components/InputGroup";
import TextArea from "../../components/TextArea";
import { Controller, useForm, useFieldArray } from "react-hook-form";

export type CreateCollectionForm = {
  collectibles: Collectible[];
  collectionName: string;
  collectionDescription: string;
  price: number;
};

const CreateCollectionPage = () => {
  const { handleSubmit, setValue, control, watch } =
    useForm<CreateCollectionForm>({
      defaultValues: {
        collectibles: [{ image: "", name: "", quantity: 1 }],
        collectionName: "",
        collectionDescription: "",
        price: 0,
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "collectibles",
  });

  const [collectibles] = watch(["collectibles"]);

  return (
    <div className="debug-screens">
      <Head>
        <title>Merchandise | Connexus</title>
      </Head>

      <form
        className="py-12 px-4 sm:px-12"
        onSubmit={handleSubmit((val: any) => {
          console.log("Create merchandise form -> ", val);
        })}
      >
        <h1 className="text-3xl font-bold">
          Create a New Merchandise Collection
        </h1>
        <h2 className="py-6 text-gray-700">
          Upload a digital merchandise collection
        </h2>

        <section className="flex w-full max-w-3xl flex-row flex-wrap gap-4 sm:flex-col">
          <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <label className="label pl-0">
                <span className="label-text">Upload Files*</span>
              </label>
              <p className="label-text">
                Supported file formats: JPEG, GIF, MP4
              </p>
            </div>

            <Button
              className="w-full sm:w-fit"
              variant="solid"
              size="sm"
              type="button"
              onClick={() => {
                append({ image: "", name: "", quantity: 1 });
              }}
            >
              Add item
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 lg:grid-cols-2">
            {fields.map((field, index) => (
              <CollectibleInput
                key={index}
                collectible={collectibles[index]}
                index={index}
                setValue={setValue}
                remove={remove}
              />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <Controller
            control={control}
            name="collectionName"
            rules={{ required: "Collection Name is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                className="max-w-3xl"
                type="text"
                label="Collection Name*"
                value={value}
                onChange={onChange}
                placeholder="Collection Name"
                errorMessage={error?.message}
                size="md"
                variant="bordered"
              />
            )}
          />

          <Controller
            control={control}
            name="collectionDescription"
            rules={{ required: "Collection Description is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextArea
                className="max-w-3xl"
                placeholder="Give your collection a description!"
                label="Collection Description"
                value={value}
                onChange={onChange}
                errorMessage={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            rules={{
              required: "Price is required",
              validate: {
                priceIsZero: (val: number) =>
                  val > 0 || "Price must be greater than 0",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputGroup
                className="max-w-3xl"
                type="text"
                label="Price*"
                value={value}
                onChange={onChange}
                placeholder="0"
                errorMessage={error?.message}
                size="md"
                variant="bordered"
              >
                $
              </InputGroup>
            )}
          />
        </section>
        <div className="divider" />
        <section className="flex flex-col justify-between gap-y-6 pt-2 pb-20 lg:flex-row">
          <div>
            Total number of items:{" "}
            <span className="ml-1 text-blue-600 underline">
              {collectibles.length}
            </span>
          </div>
          <Button type="submit" variant="solid" size="md" className="lg:w-40">
            Submit
          </Button>
        </section>
      </form>
    </div>
  );
};

export default CreateCollectionPage;
