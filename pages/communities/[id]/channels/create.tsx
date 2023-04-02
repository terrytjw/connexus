import { Collection } from "@prisma/client";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import Layout from "../../../../components/Layout";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import Button from "../../../../components/Button";
import CollectibleInput from "../../../../components/CollectibleInput";
import Input from "../../../../components/Input";
import InputGroup from "../../../../components/InputGroup";
import Loading from "../../../../components/Loading";
import Modal from "../../../../components/Modal";
import TextArea from "../../../../components/TextArea";
import Select from "../../../../components/Select";
import useSWR from "swr";
import {
  createCollection,
  getUnsoldUnlinkedCollections,
} from "../../../../lib/api-helpers/collection-api";
import { createPremiumChannelAPI } from "../../../../lib/api-helpers/channel-api";

export type CreateChannelForm = {
  channelName: string;
  collection: Collection;
  collectibles: {
    name: string;
    image: string;
    totalMerchSupply: number;
  }[];
  collectionName: string;
  collectionDescription: string;
  price: number;
};

const CreatePremiumChannelPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: session } = useSession();
  const userId = session?.user.userId;

  const [displayCollectionForm, setDisplayCollectionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: collections, isLoading: isLoadingSWR } = useSWR(
    "getUnsoldUnlinkedCollections",
    async () => await getUnsoldUnlinkedCollections(Number(userId))
  );

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreateChannelForm>({
    defaultValues: {
      channelName: "",
      collection: null as unknown as Collection,
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

  if (isLoadingSWR) {
    return <Loading />;
  }

  const createChannel = async (formData: CreateChannelForm) => {
    setIsLoading(true);
    setIsModalOpen(true);

    if (displayCollectionForm) {
      const res = await createCollection(
        formData.collectionName,
        formData.collectionDescription,
        parseInt(session!.user.userId),
        Number(formData.price),
        formData.collectibles
      );

      console.log({
        collectionName: formData.collectionName,
        description: formData.collectionDescription,
        userId: parseInt(session!.user.userId),
        price: Number(formData.price),
        collectibles: formData.collectibles,
      });

      const channelData = {
        channelName: formData.channelName,
        collectionId: res.data[0].collectionId,
        communityId: Number(id),
      };
      console.log(channelData);

      await createPremiumChannelAPI(
        formData.channelName,
        res.data[0].collectionId,
        Number(id)
      );
    } else {
      const channelData = {
        channelName: formData.channelName,
        collectionId: formData.collection.collectionId,
        communityId: Number(id),
      };
      console.log(channelData);

      await createPremiumChannelAPI(
        formData.channelName,
        formData.collection.collectionId,
        Number(id)
      );
    }

    setIsLoading(false);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Modal isOpen={isModalOpen} setIsOpen={() => {}}>
          {isLoading ? (
            <Loading className="!h-full" />
          ) : (
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-semibold">
                Premium Channel Created!
              </h3>

              <p>Your premium channel has been successfully created.</p>

              <div className="flex gap-4">
                <Button variant="solid" size="md" href={`/communities/${id}`}>
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <form
          className="py-12 px-4 sm:px-12"
          onSubmit={handleSubmit(createChannel)}
        >
          <div className="mb-8 flex items-center gap-4">
            <Button
              type="button"
              className="hidden border-0 lg:block"
              variant="outlined"
              size="md"
              onClick={() => history.back()}
            >
              <FaChevronLeft />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                Create a New Premium Channel
              </h1>
              <h2 className="mt-4 text-gray-700">
                Link to an existing digital merchandise collection or create a
                new digital merchandise collection
              </h2>
            </div>
          </div>

          <div className="max-w-3xl lg:ml-16">
            <Controller
              control={control}
              name="channelName"
              rules={{ required: "Channel Name is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Channel Name*"
                  value={value}
                  onChange={onChange}
                  placeholder="Channel Name"
                  errorMessage={error?.message}
                  size="md"
                  variant="bordered"
                />
              )}
            />

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="radio"
                  name="radio-10"
                  className="radio checked:bg-blue-600"
                  checked={!displayCollectionForm}
                  onChange={() => setDisplayCollectionForm(false)}
                />
                <span className="label-text">Link to existing collection</span>
              </label>
            </div>

            {displayCollectionForm ? null : (
              <Controller
                control={control}
                name="collection"
                rules={{ required: "Collection is required" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className="form-control mt-4 w-full">
                    <Select
                      data={
                        collections.length > 0
                          ? collections.map((collection: Collection) => {
                              return {
                                ...collection,
                                name: collection.collectionName,
                              };
                            })
                          : [{ name: "No existing collections" }]
                      }
                      selected={value ?? { name: "Select a collection" }}
                      setSelected={(value: Collection) => {
                        if (value.collectionId) {
                          setValue("collection", value);
                          return;
                        }
                      }}
                    />
                    <label className="label">
                      <span className="label-text-alt text-red-500">
                        {error ? error.message : ""}
                      </span>
                    </label>
                  </div>
                )}
              />
            )}

            <div className="form-control mt-4">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="radio"
                  name="radio-10"
                  className="radio checked:bg-blue-600"
                  checked={displayCollectionForm}
                  onChange={() => setDisplayCollectionForm(true)}
                />
                <span className="label-text">Create a new collection</span>
              </label>
            </div>

            {displayCollectionForm ? (
              <>
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
              </>
            ) : (
              <Button
                type="submit"
                variant="solid"
                size="md"
                className="mt-8 lg:w-40"
                disabled={isLoading}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreatePremiumChannelPage;
