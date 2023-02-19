import React, { useState } from "react";
import Head from "next/head";
import Button from "../../components/Button";
import CollectionItemInput from "../../components/CollectionItemInput";
import { Item } from "../index";
import Input from "../../components/Input";
import InputGroup from "../../components/InputGroup";
import TextArea from "../../components/TextArea";
import {
  Controller,
  useForm,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";

const CreateMerchandisePage = () => {
  const [items, setItems] = useState([
    { image: "", description: "", quantity: 1 },
  ]);

  type CreateMerchandiseForm = {
    items: Item[];
    collectionName: string;
    collectionDescription: string;
    price: number;
  };
  const { handleSubmit, setValue, control, watch } =
    useForm<CreateMerchandiseForm>({
      defaultValues: {
        items: [{ image: "", description: "", quantity: 1 }],
        collectionName: "",
        collectionDescription: "",
        price: 0,
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <div className="debug-screens">
      <Head>
        <title>Merchandise | Connexus</title>
      </Head>

      <form
        className="p-10"
        onSubmit={handleSubmit((val: any) => {
          console.log("Create merchandise form -> ", val);
        })}
      >
        <h1 className="text-3xl font-bold">
          Create a New Merchandise Collection
        </h1>
        <h2 className="py-6 text-gray-700">View your digital merchandise</h2>

        <section className="mt-4 flex flex-wrap items-center gap-4">
          <Button
            variant="outlined"
            size="md"
            onClick={() => {
              console.log(items);
            }}
          >
            View items in console
          </Button>
          <Button
            variant="outlined"
            size="md"
            className="rounded-full"
            onClick={() => {
              // setItems([...items, { image: "", description: "", quantity: 1 }]);
              append({ image: "", description: "", quantity: 1 });
            }}
          >
            Add item
          </Button>
        </section>
        <p className="mt-8">Supported file formats: JPEG, GIF, MP4</p>
        <section className="mt-2 flex flex-row flex-wrap justify-center gap-4 lg:flex-col">
          {fields.map((item, index) => (
            <CollectionItemInput
              key={index}
              item={item}
              updateItem={(updatedItem: Item) => {
                setItems(
                  items.map((item1, index1) =>
                    // need to compare index in order to update current item
                    index == index1 ? updatedItem : item1
                  )
                );
              }}
              deleteItem={() => {
                setItems(
                  items.filter((item1) => {
                    return item1 != item;
                  })
                );
              }}
            />
          ))}
        </section>

        <section className="mt-8 lg:w-2/3">
          <Controller
            control={control}
            name="collectionName"
            rules={{ required: "Collection Name is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
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
            <span className="ml-1 text-blue-600 underline">{items.length}</span>
          </div>
          <Button type="submit" variant="solid" size="md" className="lg:w-40">
            Submit
          </Button>
        </section>
      </form>
    </div>
  );
};

export default CreateMerchandisePage;
