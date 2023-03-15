import Head from "next/head";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import Button from "../../components/Button";
import CollectibleInput from "../../components/CollectibleInput";
import Input from "../../components/Input";
import InputGroup from "../../components/InputGroup";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import TextArea from "../../components/TextArea";
import { createCollection } from "../../lib/api-helpers/collection-api";

export type CreateCollectionForm = {
  collectibles: {
    name: string;
    image: string;
    totalMerchSupply: number;
  }[];
  collectionName: string;
  collectionDescription: string;
  price: number;
};

const CreateCollectionPage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreateCollectionForm>({
    defaultValues: {
      collectibles: [{ image: "", name: "", totalMerchSupply: 1 }],
      collectionName: "",
      collectionDescription: "",
      price: "" as unknown as number,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "collectibles",
  });

  const [collectibles] = watch(["collectibles"]);

  const onSubmit = async (formData: CreateCollectionForm) => {
    setIsLoading(true);
    setIsModalOpen(true);

    await createCollection(
      formData.collectionName,
      formData.collectionDescription,
      parseInt(session!.user.userId),
      Number(formData.price),
      formData.collectibles
    );

    setIsLoading(false);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="debug-screens">
          <Head>
            <title>Merchandise | Connexus</title>
          </Head>

          <Modal isOpen={isModalOpen} setIsOpen={() => {}}>
            {isLoading ? (
              <Loading className="!h-full" />
            ) : (
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-semibold">Collected Created!</h3>

                <p>
                  Your collection can be viewed in the ‘On Sale’ tab in the
                  Digital Merchandise page of yours.
                </p>

                <div className="flex gap-4">
                  <Button variant="solid" size="md" href={`/merchandise`}>
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          <form
            className="py-12 px-4 sm:px-12"
            onSubmit={handleSubmit(onSubmit)}
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
              <CollectibleInput
                control={control}
                watch={watch}
                trigger={trigger}
                setValue={setValue}
                fields={fields}
                errors={errors}
                addNewCollectible={() =>
                  append({ image: "", name: "", totalMerchSupply: 1 })
                }
                remove={remove}
              />

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
                  disabled={isLoading}
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
