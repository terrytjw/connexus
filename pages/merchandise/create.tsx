import React, { useState } from "react";
import Head from "next/head";
import Button from "../../components/Button";
import CollectionItemInput from "../../components/CollectionItemInput";
import { Item } from "../index";
import Input from "../../components/Input";
import InputGroup from "../../components/InputGroup";
import TextArea from "../../components/TextArea";

const CreateMerchandisePage = () => {
  const [items, setItems] = useState([
    { image: "", description: "", quantity: 1 },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [textAreaContent, setTextAreaContent] = useState("");
  const [inputGrpValue, setInputGrpValue] = useState("");

  return (
    <div className="debug-screens">
      <Head>
        <title>Merchandise | Connexus</title>
      </Head>

      <main className="p-10">
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
            size="md"
            variant="bordered"
            label="Collection Name*"
            placeholder="Collection Name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <TextArea
            label="Collection Description*"
            placeholder="Give your collection a description!"
            value={textAreaContent}
            onChange={(e) => setTextAreaContent(e.target.value)}
          />
          <InputGroup
            type="text"
            size="md"
            variant="bordered"
            label="Price*"
            placeholder="20"
            value={inputGrpValue}
            onChange={(e) => setInputGrpValue(e.target.value)}
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
          <Button
            variant="solid"
            size="md"
            className="lg:w-40"
            onClick={() => {
              console.log("Submit create merchandise form");
            }}
          >
            Submit
          </Button>
        </section>
      </main>
    </div>
  );
};

export default CreateMerchandisePage;
