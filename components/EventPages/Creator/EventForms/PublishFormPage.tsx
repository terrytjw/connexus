import { useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FaRegHeart } from "react-icons/fa";
import EventPreviewPage from "./EventPreviewPage";
import Button from "../../../Button";
import Image from "next/image";
import { PrivacyType, Ticket, VisibilityType } from "@prisma/client";
import { EventWithAllDetails } from "../../../../utils/types";
import { formatDate } from "../../../../utils/date-util";

type PublishFormPageProps = {
  watch: UseFormWatch<EventWithAllDetails>;
  setValue: UseFormSetValue<EventWithAllDetails>;
  setIsCreateSuccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean | undefined;
};

const PublishFormPage = ({
  watch,
  setValue,
  setIsCreateSuccessModalOpen,
  isLoading,
}: PublishFormPageProps) => {
  // form values
  const {
    eventName,
    eventPic,
    startDate,
    endDate,
    address,
    maxAttendee,
    visibilityType,
    privacyType,
    tickets,
  } = watch();
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const checkAttendeesExists = (): boolean | undefined => {
    return tickets.some((ticket: any) => {
      if (ticket.users) {
        return ticket.users?.length !== 0;
      } else {
        false;
      }
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      {!isPreview ? (
        <div>
          <section>
            <div>
              {/* TODO: Abstract out to event grid item  */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Preview Event Details
                </h2>
                <div className="gap-y-15 grid grid-cols-1 gap-x-6 pt-8 sm:grid-cols-3">
                  <div
                    className="group rounded-lg p-2 text-sm no-underline hover:cursor-pointer hover:bg-gray-200 hover:shadow-md"
                    onClick={() => setIsPreview((prev) => !prev)}
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg group-hover:opacity-75">
                      <Image
                        src={eventPic ? eventPic : ""}
                        alt={eventName}
                        className="h-full w-full object-cover object-center"
                        width={100}
                        height={100}
                      />
                      <div className="absolute inset-x-0 top-0 flex h-full items-end justify-between overflow-hidden rounded-lg p-4">
                        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50" />
                        <Button
                          size="md"
                          variant="outlined"
                          className=" !btn-circle relative ml-auto rounded-full border-0 !bg-neutral-100 text-lg font-semibold text-blue-600 hover:!bg-opacity-30 "
                        >
                          <FaRegHeart size={24} />
                        </Button>
                      </div>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                      {eventName}
                    </h3>
                    <p className="mt-2 text-base font-semibold text-gray-500">
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                    <div className="mt-2 text-sm font-normal">
                      <span>{address?.locationName}</span>
                    </div>

                    <p className="text-s mt-2 font-semibold text-blue-600">
                      {maxAttendee} attendees
                    </p>
                  </div>
                </div>
                <Button
                  variant="solid"
                  size="md"
                  className="mt-4 max-w-xs"
                  onClick={() => setIsPreview((prev) => !prev)}
                >
                  Preview Event
                </Button>
              </div>

              {/* Radios */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold text-gray-900">
                  Who can see your event?
                </h2>
                <fieldset className="mt-8">
                  <div className="space-y-5">
                    {Object.values(PrivacyType).map((privacyOption) => (
                      <div
                        key={privacyOption}
                        className="relative flex items-start"
                      >
                        <div className="flex h-5 items-center">
                          <input
                            name="privacyType"
                            type="radio"
                            value={privacyOption}
                            checked={privacyOption === privacyType}
                            className="radio checked:bg-blue-600"
                            onChange={(e) =>
                              setValue(
                                "privacyType",
                                e.target.value as PrivacyType
                              )
                            }
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor={privacyOption}
                            className="font-medium text-gray-800"
                          >
                            {privacyOption === PrivacyType.PRIVATE
                              ? "Private"
                              : "Public"}
                          </label>
                          <p className="text-gray-500">
                            {privacyOption === PrivacyType.PRIVATE
                              ? "Only available to selected audience"
                              : "Shard on Connexus and search engines"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Dummy component */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold text-gray-900">
                  When should we publish your event?
                </h2>
                <fieldset className="mt-8">
                  <div className="space-y-5">
                    {Object.values(VisibilityType).map((visibilityOption) => (
                      <div
                        key={visibilityOption}
                        className="relative flex items-start"
                      >
                        <div className="flex h-5 items-center">
                          <input
                            name="visibilityType"
                            type="radio"
                            value={visibilityOption}
                            checked={visibilityOption === visibilityType}
                            className="radio checked:bg-blue-600"
                            onChange={(e) =>
                              setValue(
                                "visibilityType",
                                e.target.value as VisibilityType
                              )
                            }
                            disabled={
                              checkAttendeesExists() &&
                              visibilityOption == VisibilityType.DRAFT
                            }
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor={visibilityOption}
                            className={`font-medium text-gray-800 ${
                              checkAttendeesExists() &&
                              visibilityOption == VisibilityType.DRAFT &&
                              "text-slate-300"
                            }`}
                          >
                            {visibilityOption === VisibilityType.PUBLISHED
                              ? "Now"
                              : "Later"}
                          </label>
                          <p
                            className={`text-gray-500 ${
                              checkAttendeesExists() &&
                              visibilityOption == VisibilityType.DRAFT &&
                              "text-slate-300"
                            }`}
                          >
                            {visibilityOption === VisibilityType.PUBLISHED
                              ? "Publish now"
                              : "Keep as Draft"}
                          </p>
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
                // using react hook form onSubmit to submit data
                setIsCreateSuccessModalOpen(true);
              }}
              // disabled={isLoading}
            >
              Publish
            </Button>
          </div>
        </div>
      ) : (
        <EventPreviewPage watch={watch} setIsPreview={setIsPreview} />
      )}
    </div>
  );
};

export default PublishFormPage;
