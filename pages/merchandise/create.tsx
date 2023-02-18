import React, { useState } from "react";
import Head from "next/head";
import Button from "../../components/Button";
import CollectionItemInput from "../../components/CollectionItemInput";
import { Item } from "../index";
import Input from "../../components/Input";
import InputGroup from "../../components/InputGroup";
import TextArea from "../../components/TextArea";
import { useForm, SubmitHandler } from "react-hook-form";

const CreateMerchandisePage = () => {
  const [items, setItems] = useState([
    { image: "", description: "", quantity: 1 },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [textAreaContent, setTextAreaContent] = useState("");
  const [inputGrpValue, setInputGrpValue] = useState("");

  type CreateMerchandiseForm = {
    items: Item[];
    collectionName: string;
    collectionDescription: string;
    price: number;
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateMerchandiseForm>({
    defaultValues: {
      items: [{ image: "", description: "", quantity: 1 }],
      collectionName: "",
      collectionDescription: "",
      price: 0,
    },
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
              setItems([...items, { image: "", description: "", quantity: 1 }]);
            }}
          >
            Add item
          </Button>
        </section>
        <p className="mt-8">Supported file formats: JPEG, GIF, MP4</p>
        <section className="mt-2 flex flex-row flex-wrap justify-center gap-4 lg:flex-col">
          {items.map((item, index) => (
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
          <Input
            type="text"
            label="Collection Name*"
            name="collectionName"
            placeholder="Collection Name"
            register={register}
            errors={errors}
            required
            additionalValidations={{
              maxLength: 10,
              minLength: 2,
              validate: {
                numIsSmallerThan2: (val: string) => parseInt(val) > 2,
              },
            }} // checks if the value is greater than 1
            size="md"
            variant="bordered"
          />
          <TextArea
            label="Collection Description"
            name="collectionDescription"
            placeholder="Give your collection a description!"
            register={register}
            required
            errors={errors}
          />
          <InputGroup
            type="number"
            label="Price*"
            name="inputGroupName"
            placeholder="0"
            register={register}
            required
            errors={errors}
            size="md"
            variant="bordered"
          >
            $
          </InputGroup>
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
