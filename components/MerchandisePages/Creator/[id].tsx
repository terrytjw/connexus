import { Collection, CollectionState } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaChevronLeft, FaTimes } from "react-icons/fa";
import Badge from "../../Badge";
import Button from "../../Button";
import CollectibleGrid from "../../CollectibleGrid";
import Input from "../../Input";
import Loading from "../../Loading";
import Modal from "../../Modal";
import TextArea from "../../TextArea";
import useSWR from "swr";
import {
  CollectionWithMerchAndPremiumChannel,
  getCollection,
  updateCollectionAPI,
} from "../../../lib/api-helpers/collection-api";

const CreatorCollectionPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: collectionData,
    error,
    isLoading,
    mutate,
  } = useSWR(id, getCollection);

  const { control, handleSubmit, setValue } = useForm<Collection>({
    defaultValues: {
      collectionName: "",
      description: "",
      collectionId: null as unknown as number,
    },
  });

  const onEdit = async (formData: Collection) => {
    // to prevent auto form submission upon closing modal
    if (!isModalOpen) {
      return;
    }

    await updateCollectionAPI(
      formData.collectionName,
      formData.description,
      formData.collectionId
    );

    mutate((data: CollectionWithMerchAndPremiumChannel) => {
      return {
        ...data,
        collectionName: formData.collectionName,
        description: formData.description,
      };
    });

    setIsModalOpen(false);
  };

  if (isLoading) return <Loading />;

  return (
    <main className="py-12 px-4 sm:px-12">
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        className="overflow-visible"
      >
        <form onSubmit={handleSubmit(onEdit)}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Edit Collection</h3>
            <Button
              variant="outlined"
              size="sm"
              className="border-0"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </Button>
          </div>

          <Controller
            control={control}
            name="collectionName"
            rules={{
              required: "Collection Name is required",
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                type="text"
                label="Name"
                value={value}
                onChange={onChange}
                size="md"
                variant="bordered"
                errorMessage={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            rules={{
              required: "Description is required",
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextArea
                label="Description"
                value={value}
                onChange={onChange}
                errorMessage={error?.message}
              />
            )}
          />

          <Button variant="solid" size="md">
            Save Changes
          </Button>
        </form>
      </Modal>

      <div className="mb-8 flex items-center gap-4">
        <Button
          className="border-0"
          variant="outlined"
          size="md"
          onClick={() => history.back()}
        >
          <FaChevronLeft />
        </Button>
        <h1 className="text-3xl font-bold">{collectionData.collectionName}</h1>
      </div>

      <div className="mt-6 lg:ml-16">
        <div className="card mb-8 flex justify-between gap-6 border-2 border-gray-200 bg-white p-6">
          <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-gray-700">{collectionData.description}</h2>
            {collectionData.premiumChannel ? (
              <Badge
                className="h-min !bg-blue-100 !text-blue-600"
                size="lg"
                label={`Unlocks ${collectionData.premiumChannel?.name}`}
              />
            ) : null}
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex flex-col gap-y-4">
              <span>
                <p className="text-sm text-gray-700">Price</p>
                <p className="text-lg font-semibold text-blue-600">
                  ${collectionData.fixedPrice}
                </p>
              </span>
            </div>

            <div className="flex items-end gap-4">
              {collectionData.collectionState != CollectionState.SOLD ? (
                <Button
                  variant="solid"
                  size="md"
                  onClick={() => {
                    setValue("collectionName", collectionData.collectionName);
                    setValue("description", collectionData.description);
                    setValue("collectionId", collectionData.collectionId);
                    setIsModalOpen(true);
                  }}
                >
                  Edit Collection
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        <CollectibleGrid
          data={collectionData.merchandise}
          collectedTab={false}
        />
      </div>
    </main>
  );
};

export default CreatorCollectionPage;
