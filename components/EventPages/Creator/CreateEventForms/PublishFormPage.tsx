import { useState } from "react";
import { Control, UseFormWatch, useWatch } from "react-hook-form";
import { FaHeart, FaCalendar, FaMapPin, FaPersonBooth } from "react-icons/fa";
import { Event } from "../../../../pages/events/create"; // replace with Prisma Type
import EventPreviewPage from "./EventPreviewPage";
import Button from "../../../Button";
import Image from "next/image";
import { format } from "date-fns";

type PublishFormPageProps = {
  privacy: {
    id: string;
    name: string;
    description: string;
  }[];
  publish: {
    id: string;
    name: string;
    description: string;
  }[];
  watch: UseFormWatch<Event>;
};

const PublishFormPage = ({ privacy, publish, watch }: PublishFormPageProps) => {
  // form values
  const [
    name,
    bannerPic,
    profilePic,
    startDateTime,
    endDateTime,
    tags,
    tickets,
    venue,
    maxAttendees,
  ] = watch([
    "name",
    "bannerPic",
    "profilePic",
    "startDateTime",
    "endDateTime",
    "tags",
    "tickets",
    "venue",
    "maxAttendees",
  ]);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const formValues = watch();
  console.log("WATCH ", formValues);
  return (
    <div>
      {!isPreview ? (
        <div>
          <section>
            <div>
              <div className="">
                <h2 className="text-xl font-semibold ">
                  Preview Event Details
                </h2>
                <div className="gap-y-15 grid grid-cols-1 gap-x-6 pt-8 sm:grid-cols-4">
                  <div
                    className="group link mb-8 text-sm no-underline hover:cursor-pointer"
                    onClick={() => setIsPreview((prev) => !prev)}
                  >
                    <div className="aspect-w-1 aspect-h-1 relative w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                      <Image
                        src={profilePic ? URL.createObjectURL(profilePic) : ""}
                        alt={name}
                        className="h-full w-full object-cover object-center"
                        width={100}
                        height={100}
                      />
                      <div className="absolute inset-x-0 top-0 flex h-full items-end justify-between overflow-hidden rounded-lg p-4">
                        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50" />
                        <Button
                          variant="solid"
                          size="sm"
                          className="relative ml-auto rounded-full text-lg font-semibold text-white"
                        >
                          <FaHeart />
                        </Button>
                      </div>
                    </div>
                    <h3 className="mt-4 font-medium text-gray-900">{name}</h3>

                    <span className="flex">
                      <FaCalendar />
                      <p className="ml-2 text-gray-500">
                        {format(new Date(startDateTime), "PPPPpppp")}
                      </p>
                    </span>
                    <span className="flex align-middle">
                      <FaMapPin />
                      <p className="ml-2 text-sm text-gray-500">
                        {venue.venueName}
                      </p>
                    </span>
                    <span className="flex">
                      <FaPersonBooth />
                      <p className="ml-2 text-sm text-gray-500">
                        {maxAttendees}
                      </p>
                    </span>
                  </div>
                </div>
              </div>

              {/* Dummy component */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold ">
                  Who can see your event?
                </h2>
                <fieldset className="mt-8">
                  <div className="space-y-5">
                    {privacy.map((privacy) => (
                      <div
                        key={privacy.id}
                        className="relative flex items-start"
                      >
                        <div className="flex h-5 items-center">
                          <input
                            id={privacy.id}
                            name="privacyType"
                            type="radio"
                            defaultChecked={true}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor={privacy.id}
                            className="font-medium text-gray-700"
                          >
                            {privacy.name}
                          </label>
                          <p className="text-gray-500">{privacy.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Dummy component */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold ">
                  When should we publish your event?
                </h2>
                <fieldset className="mt-8">
                  <div className="space-y-5">
                    {publish.map((publish) => (
                      <div
                        key={publish.id}
                        className="relative flex items-start"
                      >
                        <div className="flex h-5 items-center">
                          <input
                            id={publish.id}
                            name="privacyType"
                            type="radio"
                            defaultChecked={true}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor={publish.id}
                            className="font-medium text-gray-700"
                          >
                            {publish.name}
                          </label>
                          <p className="text-gray-500">{publish.description}</p>
                          {publish.id === "later" && (
                            <div className="text-green-400">
                              todo: add date input
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </section>
          <div className="sticky bottom-0 z-30 flex items-center justify-end gap-6 bg-sky-100 py-2 sm:relative">
            <Button
              variant="solid"
              size="md"
              className="max-w-3xl"
              onClick={() => {
                // validation logic
              }}
            >
              Publish
            </Button>
          </div>
        </div>
      ) : (
        // show preview page, passing props bc passing 'watch' doesn't seem to work
        <EventPreviewPage formValues={formValues} setIsPreview={setIsPreview} />
      )}
    </div>
  );
};

export default PublishFormPage;
