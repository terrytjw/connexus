import { Collection, CollectionState } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaSearch, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import CollectionTable from "../CollectionTable";
import Button from "../../Button";
import Input from "../../Input";
import Loading from "../../Loading";
import Modal from "../../Modal";
import TabGroupBordered from "../../TabGroupBordered";
import TextArea from "../../TextArea";
import useSWR from "swr";
import {
  CollectionWithMerchAndPremiumChannel,
  searchCreatorCollectionsByState,
  updateCollectionAPI,
} from "../../../lib/api-helpers/collection-api";

const CreatorCollectionsPage = () => {
  const { data: session } = useSession();
  const userId = session?.user.userId;

  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onSaleCollections, setOnSaleCollections] = useState<
    CollectionWithMerchAndPremiumChannel[]
  >([]);
  const [pausedCollections, setPausedCollections] = useState<
    CollectionWithMerchAndPremiumChannel[]
  >([]);
  const [soldCollections, setSoldCollections] = useState<
    CollectionWithMerchAndPremiumChannel[]
  >([]);

  const {
    isLoading: isOnSaleCollectionsDataLoading,
    mutate: mutateOnSaleCollections,
  } = useSWR(
    {
      userId: userId,
      collectionState: CollectionState.ON_SALE,
      keyword: "",
    },
    searchCreatorCollectionsByState,
    { onSuccess: setOnSaleCollections, revalidateOnFocus: false }
  );

  const {
    isLoading: isPausedCollectionsDataLoading,
    mutate: mutatePausedCollections,
  } = useSWR(
    {
      userId: userId,
      collectionState: CollectionState.PAUSED,
      keyword: "",
    },
    searchCreatorCollectionsByState,
    { onSuccess: setPausedCollections, revalidateOnFocus: false }
  );

  const { isLoading: isSoldCollectionsDataLoading } = useSWR(
    {
      userId: userId,
      collectionState: CollectionState.SOLD,
      keyword: "",
    },
    searchCreatorCollectionsByState,
    { onSuccess: setSoldCollections, revalidateOnFocus: false }
  );

  const searchCollections = async () => {
    if (activeTab == 0) {
      const res = await searchCreatorCollectionsByState({
        userId: Number(userId),
        collectionState: CollectionState.ON_SALE,
        keyword: searchString,
      });
      setOnSaleCollections(res);
    } else if (activeTab == 1) {
      const res = await searchCreatorCollectionsByState({
        userId: Number(userId),
        collectionState: CollectionState.PAUSED,
        keyword: searchString,
      });
      setPausedCollections(res);
    } else if (activeTab == 2) {
      const res = await searchCreatorCollectionsByState({
        userId: Number(userId),
        collectionState: CollectionState.SOLD,
        keyword: searchString,
      });
      setSoldCollections(res);
    }
  };

  useEffect(() => {
    searchCollections();
  }, [searchString]);

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

    if (activeTab == 0) {
      await searchCollections();
    } else if (activeTab == 1) {
      await searchCollections();
    }

    toast.success(`${formData.collectionName} has been updated.`);
    setIsModalOpen(false);
  };

  if (
    isOnSaleCollectionsDataLoading ||
    isPausedCollectionsDataLoading ||
    isSoldCollectionsDataLoading
  ) {
    return <Loading />;
  }

  return (
    <main className="py-12 px-4 sm:px-12">
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
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

      <h1 className="text-4xl font-bold">Your Digital Merchandise Creation</h1>
      <h3 className="mt-4">
        View all your on sale, paused, and sold digital merchandise collections
      </h3>

      {/* mobile */}
      <div className="mt-8 flex w-full flex-col gap-4 lg:hidden">
        <Button
          href="/merchandise/create"
          variant="solid"
          size="md"
          className="w-fit"
        >
          Create a New Collection
        </Button>

        <div className="flex gap-x-2">
          <div className="relative w-full items-center justify-center rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              className="input-outlined input input-md block w-full rounded-md pl-10"
              type="text"
              value={searchString}
              placeholder="Search Collections"
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      {/* desktop */}
      <div className="mt-10 hidden items-center justify-between gap-x-4 lg:flex">
        <Button href="/merchandise/create" variant="solid" size="md">
          Create a New Collection
        </Button>

        <div className="flex gap-x-4">
          <div className="relative items-center justify-center rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              className="input-outlined input input-md block w-full rounded-md pl-10"
              type="text"
              value={searchString}
              placeholder="Search Collections"
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <TabGroupBordered
        tabs={["On Sale", "Paused", "Sold"]}
        activeTab={activeTab}
        setActiveTab={(index: number) => {
          setActiveTab(index);
        }}
      >
        {activeTab == 0 && (
          <CollectionTable
            data={onSaleCollections}
            columns={[
              "Collection No.",
              "Collection Name",
              "Description",
              "Quantity Left",
              "Fee",
              "Premium Channel",
            ]}
            onEdit={(index: number) => {
              setValue(
                "collectionName",
                onSaleCollections[index].collectionName
              );
              setValue("description", onSaleCollections[index].description);
              setValue("collectionId", onSaleCollections[index].collectionId);
              setIsModalOpen(true);
            }}
            mutateOnSaleCollections={mutateOnSaleCollections}
            mutatePausedCollections={mutatePausedCollections}
          />
        )}
        {activeTab == 1 && (
          <CollectionTable
            data={pausedCollections}
            columns={[
              "Collection No.",
              "Collection Name",
              "Description",
              "Quantity Left",
              "Fee",
              "Premium Channel",
            ]}
            onEdit={(index: number) => {
              setValue(
                "collectionName",
                pausedCollections[index].collectionName
              );
              setValue("description", pausedCollections[index].description);
              setValue("collectionId", pausedCollections[index].collectionId);
              setIsModalOpen(true);
            }}
            mutateOnSaleCollections={mutateOnSaleCollections}
            mutatePausedCollections={mutatePausedCollections}
          />
        )}
        {activeTab == 2 && (
          <CollectionTable
            data={soldCollections}
            columns={[
              "Collection No.",
              "Collection Name",
              "Description",
              "Quantity",
              "Fee",
              "Premium Channel",
            ]}
          />
        )}
      </TabGroupBordered>
    </main>
  );
};

export default CreatorCollectionsPage;
