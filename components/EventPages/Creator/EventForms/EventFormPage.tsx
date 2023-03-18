import React, { useEffect, useState } from "react";
import {
  UseFormSetValue,
  Control,
  UseFormTrigger,
  Controller,
  UseFormWatch,
} from "react-hook-form";
import Badge from "../../../Badge";
import BannerInput from "../../../BannerInput";
import Button from "../../../Button";
import Input from "../../../Input";
import InputGroup from "../../../InputGroup";
import AvatarInput from "../../../AvatarInput";
import Loading from "../../../Loading";
import { FaSearch } from "react-icons/fa";

import {
  GoogleMap,
  Autocomplete,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

import { CategoryType } from "@prisma/client";
import { EventWithAllDetails } from "../../../../utils/types";
import toast from "react-hot-toast";

type EventFormPageProps = {
  isEdit: boolean;
  watch: UseFormWatch<EventWithAllDetails>;
  setValue: UseFormSetValue<EventWithAllDetails>;
  control: Control<EventWithAllDetails, any>;
  trigger: UseFormTrigger<EventWithAllDetails>;
  proceedStep: () => void;
};

type LatLng = google.maps.LatLng;
type LatLngLiteral = google.maps.LatLngLiteral;
type AutocompleteType = google.maps.places.Autocomplete;
type GeocoderAddressComponent = google.maps.GeocoderAddressComponent;

const EventFormPage = ({
  isEdit,
  watch,
  setValue,
  control,
  trigger,
  proceedStep,
}: EventFormPageProps) => {
  const libraries: (
    | "drawing"
    | "geometry"
    | "localContext"
    | "places"
    | "visualization"
  )[] = ["places"];
  // gmaps api loader
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDQpGQRp-UOew3yHtSDBBw8BiqOipXrxH8",
    libraries: libraries,
  });
  const [searchResult, setSearchResult] = useState<AutocompleteType>();
  // state to check for valid autocomplete values
  const [isSearchValid, setIsSearchValid] = useState<
    boolean | string | undefined
  >("initial");
  // coordinates of map
  const [center, setCenter] = useState<LatLng | LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  // watch form values
  const { bannerPic, eventPic, startDate, category, address } = watch();
  const venueExists = (): boolean => {
    return !!(address?.lat || address?.lng);
  };

  // repopulate map coordinates when user navigates back
  useEffect(() => {
    if (address.lat && address?.lng) {
      setCenter({ lat: address?.lat, lng: address?.lng });
    }
  }, [address?.lat, address?.lng]);

  // scroll to center of venue inputs when location search is valid
  useEffect(() => {
    // scroll to ticket
    document.getElementById(`venue-inputs`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [isSearchValid]);

  // get respective address components from google maps PlaceResult
  const getAddressComponent = (componentType: string): string | undefined => {
    return (
      searchResult
        ?.getPlace()
        .address_components?.find((component: GeocoderAddressComponent) =>
          component.types.find((type: string) => type === componentType)
        )?.long_name ?? ""
    );
  };

  const validateSearch = (): boolean => {
    const place = searchResult?.getPlace();
    return !!(place && place.geometry && place.geometry.location);
  };

  const handlePlaceChange = (): void => {
    setIsSearchValid(validateSearch());
    const lat = searchResult?.getPlace().geometry?.location?.lat() ?? 0;
    const lng = searchResult?.getPlace().geometry?.location?.lng() ?? 0;
    // only populate venue address fields if a valid place is returned
    if (validateSearch()) {
      setCenter({ lat, lng });
      setValue("address", {
        ...address,
        lat,
        lng,
        locationName: searchResult?.getPlace().name || "",
        address1:
          getAddressComponent("street_number") +
          " " +
          getAddressComponent("route"),
        address2: getAddressComponent("subpremise") ?? "",
        postalCode: getAddressComponent("postal_code") ?? "",
      });
    }
  };

  const checkIsEditAndDatePassed = (value: string | Date): boolean => {
    return isEdit && !!(new Date(value) < new Date());
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div>
      <BannerInput
        bannerPic={bannerPic}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              setValue("bannerPic", reader.result as string);
            });
            reader.readAsDataURL(e.target.files[0]);
          }
        }}
        onClick={() => {
          setValue("bannerPic", "");
        }}
      />

      <div className="z-10 mx-auto h-24 px-4 sm:h-32 sm:px-6 lg:px-8">
        <div className="relative -mt-12 h-24 sm:-mt-16 sm:h-32">
          <AvatarInput
            profilePic={eventPic}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                  setValue("eventPic", reader.result as string);
                });
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col gap-2">
        <Controller
          control={control}
          name="eventName"
          rules={{
            required: "Event Name is required",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="text"
              label="Event Name *"
              value={value}
              onChange={onChange}
              placeholder="Event Name"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{
            required: "Event Description is required",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="form-control w-full max-w-3xl">
              <label className="label">
                <span className="label-text">Description *</span>
              </label>
              <textarea
                className="input-group textarea-bordered textarea w-full max-w-3xl bg-white"
                placeholder="Tell us what your event is about"
                value={value ?? ""}
                onChange={onChange}
              />
              <label className="label">
                <span className="label-text-alt text-red-500">
                  {error?.message}
                </span>
              </label>
            </div>
          )}
        />

        <Controller
          control={control}
          name="startDate"
          rules={{
            required: "Start Date and Time is required",
            validate: {
              afterNow: (value) =>
                checkIsEditAndDatePassed(value)
                  ? true // skip validation if is edit and date > now()
                  : new Date(value) > new Date() ||
                    "Start Date must be later than now",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="datetime-local"
              label="Start Date and Time *"
              value={value?.toString()}
              onChange={onChange}
              placeholder="Start Date and Time"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl align-middle text-gray-500"
              disabled={checkIsEditAndDatePassed(value)} // cannot edit if event has already started
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          rules={{
            required: "End Date and Time is required *",
            validate: {
              afterStart: (value) =>
                new Date(value) > new Date(startDate) ||
                "End Date must be after Start Date ",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="datetime-local"
              label="End Date and Time *"
              value={value?.toString()}
              onChange={onChange}
              placeholder="End Date and Time"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl align-middle text-gray-500"
            />
          )}
        />

        <div className="form-control w-full max-w-3xl">
          <label className="label">
            <span className="label-text">Topics of Your Event</span>
          </label>

          <div className="input-bordered input flex h-fit flex-wrap gap-4 bg-white p-4">
            {Object.values(CategoryType).map((label, index) => {
              return (
                <Badge
                  key={index}
                  size="lg"
                  label={label}
                  selected={
                    category &&
                    category.length > 0 &&
                    category.indexOf(label) != -1
                  }
                  onClick={() => {
                    if (!category) {
                      setValue("category", [category]);
                      return;
                    }

                    if (category && category.indexOf(label) == -1) {
                      setValue("category", [...category, label]);
                      return;
                    }

                    setValue(
                      "category",
                      category?.filter((cat) => {
                        return cat != label;
                      })
                    );
                  }}
                />
              );
            })}
          </div>

          <label className="label">
            <span className="label-text-alt text-red-500">
              {/* Please select at least one topic */}
            </span>
          </label>
        </div>

        {/* Map */}
        {((isSearchValid !== "initial" && isSearchValid) || venueExists()) && (
          <div className="h-full w-full sm:max-w-3xl ">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "200px" }}
              center={center}
              zoom={15}
              options={{
                gestureHandling: "none",
                disableDefaultUI: true,
                zoomControl: false,
                clickableIcons: false,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                ],
                keyboardShortcuts: false,
              }}
            >
              <Marker
                position={center}
                onLoad={(marker) => {
                  console.log("marker: ", marker);
                }}
              />
            </GoogleMap>
          </div>
        )}

        <Autocomplete
          restrictions={{
            country: "sg",
          }}
          options={{
            strictBounds: true,
          }}
          onPlaceChanged={handlePlaceChange}
          onLoad={(autocomplete) => setSearchResult(autocomplete)}
        >
          <InputGroup
            type="text"
            label={`Search ${venueExists() ? "another " : ""}Location`}
            onChange={() => ""}
            placeholder={`Search ${venueExists() ? "another " : ""}Location`}
            size="md"
            variant="bordered"
            className="autocomplete-input max-w-3xl"
            errorMessage={
              isSearchValid === "initial"
                ? ""
                : isSearchValid
                ? ""
                : "Please Select a Valid Place"
            }
          >
            <FaSearch />
          </InputGroup>
        </Autocomplete>

        {/* venue address inputs */}
        {((isSearchValid !== "initial" && isSearchValid) || venueExists()) && (
          <div id="venue-inputs">
            <Controller
              control={control}
              name="address.locationName"
              rules={{
                required: "Location Name is required",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Location Name *"
                  value={value}
                  onChange={onChange}
                  placeholder="Location Name"
                  size="md"
                  variant="bordered"
                  errorMessage={error?.message}
                  className="max-w-3xl"
                />
              )}
            />
            <Controller
              control={control}
              name="address.address1"
              rules={{
                required: "Address 1 is required",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Address 1 *"
                  value={value}
                  onChange={onChange}
                  placeholder="Address 1"
                  size="md"
                  variant="bordered"
                  errorMessage={error?.message}
                  className="max-w-3xl"
                />
              )}
            />
            <Controller
              control={control}
              name="address.address2"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Address 2"
                  value={value ?? ""}
                  onChange={onChange}
                  placeholder="Address 2"
                  size="md"
                  variant="bordered"
                  errorMessage={error?.message}
                  className="max-w-3xl"
                />
              )}
            />

            <Controller
              control={control}
              name="address.postalCode"
              rules={{
                required: "Postal Code is required",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="number"
                  label="Postal Code *"
                  value={value}
                  onChange={onChange}
                  placeholder="Postal Code"
                  size="md"
                  variant="bordered"
                  errorMessage={error?.message}
                  className="max-w-3xl"
                />
              )}
            />
          </div>
        )}

        <Controller
          control={control}
          name="maxAttendee"
          rules={{
            required: "Maximum Number of Attendees is required",
            validate: (value) =>
              value > 0 || "Minimum Number of Attendees is 1",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="number"
              label="Maximum Number of Attendees *"
              value={value}
              onChange={onChange}
              placeholder="Maximum Number of Attendees"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl"
            />
          )}
        />
        <div className="sticky bottom-0 z-30 flex items-center bg-sky-100 py-2 sm:relative">
          <Button
            variant="solid"
            size="md"
            className="w-full max-w-3xl"
            onClick={async () => {
              const isValidated = await trigger([
                "eventName",
                "description",
                "startDate",
                "endDate",
                "maxAttendee",
                "address.address1",
                "address.lat",
                "address.lng",
                "address.postalCode",
              ]);

              if (!(eventPic || bannerPic)) {
                toast.error("Images are required!");
                return;
              }

              if (isValidated) {
                proceedStep();
                // scroll to top of div container
                document
                  .getElementById("scrollable")
                  ?.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventFormPage;
