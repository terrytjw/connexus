import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch, FaTimes } from "react-icons/fa";
import CollectionTable from "../CollectionTable";
import Button from "../../Button";
import Input from "../../Input";
import Modal from "../../Modal";
import Select from "../../Select";
import TabGroupBordered from "../../TabGroupBordered";
import { collections, channels } from "../../../utils/dummyData";
import { ChannelType, Collection } from "../../../utils/types";
import useSWR from "swr";
import { swrFetcher } from "../../../lib/swrFetcher";
import Loading from "../../Loading";
import { updateCollection } from "../../../lib/merchandise-helpers";

const CreatorCollectionsPage = () => {
  const {
    data: collectionData,
    error,
    isLoading: isCollectionDataLoading,
    mutate,
  } = useSWR("http://localhost:3000/api/collections", swrFetcher);

  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const [query, setFilteredCollection] = useState<Collection[]>(collectionData);
  const [query, setQuery] = useState("");

  const { handleSubmit, setValue, watch } = useForm<Collection>({
    defaultValues: {
      name: "",
      description: "",
      premiumChannel: null,
      collectionId: 0,
    },
  });

  // useEffect(() => {
  //     setFilteredCollection(collectionData)
  // }, [collectionData])
  const filteredData =
    query === ''
      ? collectionData
      : collectionData.filter((item : any) =>
          item.collectionName
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  const [name, description, premiumChannel] = watch([
    "name",
    "description",
    "premiumChannel",
  ]);

  // function filterCollection(collectionData : any[]){
  //   return collectionData.filter((collection: any) => {
  //     return collection.collectionName.toLowerCase().includes(searchString.toLowerCase());
  //   })
  // }

  if (isCollectionDataLoading) return <Loading />;

  return (
    <main className="py-12 px-4 sm:px-12">
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        className="overflow-visible"
      >
        <form
          onSubmit={handleSubmit(async (val: any) => {
            // to prevent auto form submission upon closing modal
            if (!isModalOpen) {
              return;
            }

            await updateCollection(val.name, val.description, val.collectionId);

            let updatedCollection = collectionData.find(
              (collection: any) => collection.collectionId === val.collectionId
            );
            updatedCollection = {
              ...updatedCollection,
              name: val.name,
              description: val.description,
            };

            mutate([...collectionData, updatedCollection]); // TODO: ordering is messed up after update, need to clean up
            setIsModalOpen(false);
          })}
        >
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

          <Input
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setValue("name", e.target.value)}
            size="md"
            variant="bordered"
          />

          <Input
            type="text"
            label="Description"
            value={description}
            onChange={(e) => setValue("description", e.target.value)}
            size="md"
            variant="bordered"
          />

          <div className="form-control mb-4 w-full">
            <label className="label">
              <span className="label-text">Link to Premium Channel</span>
            </label>
            <Select
              data={[{ name: "Not Linked" }].concat(
                channels.filter(
                  (channel) => channel.channelType == ChannelType.PREMIUM
                )
              )}
              selected={premiumChannel ?? { name: "Not Linked" }}
              setSelected={(value) => {
                if (value.channelId) {
                  setValue("premiumChannel", value);
                  return;
                }
                // collection is not linked to any premium channel
                setValue("premiumChannel", null);
              }}
            />
            <label className="label">
              <span className="label-text-alt text-red-500"></span>
            </label>
          </div>

          <Button variant="solid" size="md">
            Save Changes
          </Button>
        </form>
      </Modal>

      <h1 className="text-4xl font-bold">Your Digital Merchandise Creation</h1>
      <h3 className="mt-4">
        View all your featured, created, on sale and sold digital merchandise
        collections
      </h3>

      {/* mobile */}
      <div className="mt-8 flex w-full flex-col gap-4 lg:hidden">
        <div className="flex gap-x-2">
          <div className="relative w-full items-center justify-center rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch />
            </div>
            <input
              className="input-outlined input input-md block w-full rounded-md pl-10"
              type="text"
              value={searchString}
              placeholder="Search Collection"
              onChange={(e) => {
                setSearchString(e.target.value);
                // console.log(e.target.value)
                // setFilteredCollection(filterCollection(collectionData)) // to be removed in future
              }}
            />
          </div>
        </div>

        <div className="flex gap-x-4">
          <Button href="/merchandise/create" variant="solid" size="md">
            Create <span className="hidden sm:contents">Collection</span>
          </Button>
          <Button variant="outlined" size="md">
            Feature <span className="hidden sm:contents">Collection</span>
          </Button>
        </div>
      </div>

      {/* desktop */}
      <div className="mt-10 hidden items-center justify-between gap-x-4 lg:flex">
        <div className="flex gap-x-4">
          <Button href="/merchandise/create" variant="solid" size="md">
            Create collection
          </Button>
          <Button variant="outlined" size="md">
            Feature collection
          </Button>
        </div>

        <div className="flex gap-x-4">
          <div className="relative items-center justify-center rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch />
            </div>
            <input
              className="input-outlined input input-md block w-full rounded-md pl-10"
              type="text"
              value={searchString}
              placeholder="Search Collection"
              onChange={(e) => {
                setSearchString(e.target.value);
                setQuery(e.target.value)
                console.log(e.target.value)
                // setFilteredCollection(filterCollection(collectionData)) // to be removed in future
                console.log(filteredData)
              }}
            />
          </div>
        </div>
      </div>

      <TabGroupBordered
        tabs={["Featured", "On Sale", "Sold"]}
        activeTab={activeTab}
        setActiveTab={(index: number) => {
          setActiveTab(index);
        }}
      >
        {activeTab == 0 && (
          <CollectionTable
            data={filteredData}
            columns={[
              "Collection No.",
              "Collection Name",
              "Description",
              "Quantity",
              "Fee",
              "Premium Channel",
            ]}
            onEdit={(index: number) => {
              setValue("name", collectionData[index].collectionName);
              setValue("description", collectionData[index].description);
              setValue("premiumChannel", collectionData[index].premiumChannel);
              setValue("collectionId", collectionData[index].collectionId); // might want to replace with collection id
              setIsModalOpen(true);
            }}
          />
        )}
        {activeTab == 1 && (
          <CollectionTable
            data={collectionData}
            columns={[
              "Collection No.",
              "Collection Name",
              "Description",
              "Quantity",
              "Fee",
              "Premium Channel",
            ]}
            onEdit={(index: number) => {
              setValue("name", collections[index].name);
              setValue("description", collections[index].description);
              setValue("premiumChannel", collections[index].premiumChannel);
              setIsModalOpen(true);
            }}
          />
        )}
        {activeTab == 2 && (
          <CollectionTable
            data={collections}
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
