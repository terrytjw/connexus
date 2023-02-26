import Head from "next/head";
import React from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import Button from "../../components/Button";
import CollectibleInput from "../../components/CollectibleInput";
import Input from "../../components/Input";
import InputGroup from "../../components/InputGroup";
import TextArea from "../../components/TextArea";
import { Collectible } from "../../utils/types";
import { createCollection } from "../../lib/merchandise-helpers";
import { useSession } from "next-auth/react";
import Loading from "../../components/Loading";

export type CreateCollectionForm = {
  collectibles: Collectible[];
  collectionName: string;
  collectionDescription: string;
  price: number;
};

const CreateCollectionPage = () => {
  const { data: session, status } = useSession();
  console.log("session -> ", session?.user.userId);
  const { handleSubmit, setValue, control, watch } =
    useForm<CreateCollectionForm>({
      defaultValues: {
        collectibles: [{ image: "", name: "", totalMerchSupply: 1 }],
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
    <ProtectedRoute>
      <Layout>
        <div className="debug-screens">
          <Head>
            <title>Merchandise | Connexus</title>
          </Head>

          <form
            className="py-12 px-4 sm:px-12"
            onSubmit={handleSubmit((val: any) => {
              console.log("Create merchandise form -> ", val);

              const collectionName = val.collectionName;
              const description = val.collectionDescription;
              const creator_id = parseInt(session!.user.userId);
              const price = parseInt(val.price);
              const collectibleArray = val.collectibles;

              createCollection(
                collectionName,
                description,
                creator_id,
                price,
                collectibleArray
              );
            })}
          >
            <div className="mb-8 flex items-center gap-4">
              <Button
                className="hidden border-0 lg:block"
                variant="outlined"
                size="md"
                onClick={() => history.back()}
              >
                <FaChevronLeft />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">
                  Create a New Merchandise Collection
                </h1>
                <h2 className="mt-4 text-gray-700">
                  Upload a digital merchandise collection
                </h2>
              </div>
            </div>

            <div className="max-w-3xl lg:ml-16">
              <section className="flex w-full flex-row flex-wrap gap-4 sm:flex-col">
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
                      append({ image: "", name: "", totalMerchSupply: 1 });
                    }}
                  >
                    Add item
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 lg:grid-cols-2">
                  {fields.map((field, index) => (
                    <CollectibleInput
                      key={field.id}
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
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
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
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextArea
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
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
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
                  <span className="ml-1 text-blue-600 underline">
                    {collectibles.length}
                  </span>
                </div>
                <Button
                  type="submit"
                  variant="solid"
                  size="md"
                  className="lg:w-40"
                >
                  Submit
                </Button>
              </section>
            </div>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateCollectionPage;
