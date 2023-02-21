import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import Badge from "../../Badge";
import Button from "../../Button";
import CollectibleGrid from "../../CollectibleGrid";
import Input from "../../Input";
import Modal from "../../Modal";
import Select from "../../Select";
import { channels, collections } from "../../../utils/dummyData";
import { ChannelType, Collection } from "../../../utils/types";

const CreatorCollectionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { handleSubmit, setValue, watch } = useForm<Collection>({
    defaultValues: {
      name: collections[0].name,
      description: collections[0].description,
      premiumChannel: collections[0].premiumChannel,
    },
  });

  const [name, description, premiumChannel] = watch([
    "name",
    "description",
    "premiumChannel",
  ]);

  return (
    <main className="py-12 px-4 sm:px-12">
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        className="overflow-visible"
      >
        <form
          onSubmit={handleSubmit((val: any) => {
            console.log("Edit collection: ", val);
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

      <h1 className="text-3xl font-bold">{collections[0].name}</h1>

      <div className="mt-6">
        <div className="card mb-8 flex justify-between gap-6 border-2 border-gray-200 bg-white p-6">
          <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-xl font-bold text-gray-700">
              {collections[0].name}
            </h1>
            <Badge
              className="h-min"
              size="lg"
              label="Unlocks Premium Channel"
            />
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex flex-col gap-y-4">
              <h2 className="text-gray-700">{collections[0].description}</h2>

              <span>
                <p className="text-sm text-gray-700">Price</p>
                <p className="text-lg font-semibold text-blue-600">$5</p>
              </span>
            </div>

            <div className="flex items-end gap-4">
              <Button
                variant="solid"
                size="md"
                onClick={() => setIsModalOpen(true)}
              >
                Edit Collection
              </Button>
            </div>
          </div>
        </div>
        <CollectibleGrid
          data={collections[0].collectibles}
          collectedTab={false}
        />
      </div>
    </main>
  );
};

export default CreatorCollectionPage;
