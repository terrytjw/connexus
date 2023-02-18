import {
  UseFormSetValue,
  Control,
  UseFormTrigger,
  Controller,
  UseFormWatch,
  useWatch,
} from "react-hook-form";
import Badge from "../../Badge";
import BannerInput from "../../BannerInput";
import Button from "../../Button";
import Input from "../../Input";
import { Event } from "../../../pages/events/create"; // replace with Prisma Type
import AvatarInput from "../../AvatarInput";
import {
  GoogleMap,
  Autocomplete,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import Loading from "../../Loading";
import { FaSearch } from "react-icons/fa";
import InputGroup from "../../InputGroup";

type EventFormPageProps = {
  watch: UseFormWatch<Event>;
  labels: string[];
  setValue: UseFormSetValue<Event>;
  control: Control<Event, any>;
  trigger: UseFormTrigger<Event>;
  proceedStep: () => void;
};

type LatLng = google.maps.LatLng;
type LatLngLiteral = google.maps.LatLngLiteral;
type AutocompleteType = google.maps.places.Autocomplete;
type GeocoderAddressComponent = google.maps.GeocoderAddressComponent;

const EventFormPage = ({
  watch,
  labels,
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
  )[] = useMemo(() => ["places"], []);
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
  const [bannerPic, profilePic, tags, venue] = watch([
    "bannerPic",
    "profilePic",
    "tags",
    "venue",
  ]);
  const venueExists = (): boolean => {
    return !!(venue.lat || venue?.lng);
  };

  // repopulate map coordinates when user navigates back
  useEffect(() => {
    if (venue.lat && venue?.lng) {
      setCenter({ lat: venue?.lat, lng: venue?.lng });
    }
  }, [venue?.lat, venue?.lng]);

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
      setValue("venue", {
        ...venue,
        lat,
        lng,
        venueName: searchResult?.getPlace().name || "",
        address1:
          getAddressComponent("street_number") +
          " " +
          getAddressComponent("route"),
        address2: getAddressComponent("subpremise") ?? "",
        postalCode: Number(getAddressComponent("postal_code")),
      });
      document.getElementById(`venue-inputs`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
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
            setValue("bannerPic", e.target.files[0]);
          }
        }}
        onClick={() => {
          setValue("bannerPic", null as unknown as File);
        }}
      />

      <div className="z-10 mx-auto h-24 px-4 sm:h-32 sm:px-6 lg:px-8">
        <div className="relative -mt-12 h-24 sm:-mt-16 sm:h-32">
          <AvatarInput
            profilePic={profilePic}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setValue("profilePic", e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col gap-2">
        <Controller
          control={control}
          name="name"
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
                value={value}
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
          name="startDateTime"
          rules={{
            required: "Start Date and Time is required", // validate: (value) =>
            //   (value = "date type" || "Proper date format is required"),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="datetime-local"
              label="Start Date and Time *"
              value={value}
              onChange={onChange}
              placeholder="Start Date and Time"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl align-middle text-gray-400"
            />
          )}
        />

        <Controller
          control={control}
          name="endDateTime"
          rules={{
            required: "End Date and Time is required *", // validate: (value) =>
            //   (value = "date type" || "Proper date format is required"),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              type="datetime-local"
              label="End Date and Time *"
              value={value}
              onChange={onChange}
              placeholder="End Date and Time"
              size="md"
              variant="bordered"
              errorMessage={error?.message}
              className="max-w-3xl align-middle text-gray-400"
            />
          )}
        />

        <div className="form-control w-full max-w-3xl">
          <label className="label">
            <span className="label-text">Topics of Your Event</span>
          </label>

          <div className="input-bordered input flex h-fit flex-wrap gap-4 bg-white p-4">
            {labels.map((label, index) => {
              return (
                <Badge
                  key={index}
                  size="lg"
                  label={label}
                  selected={
                    tags && tags.length > 0 && tags.indexOf(label) != -1
                  }
                  onClick={() => {
                    if (!tags) {
                      setValue("tags", [label]);
                      return;
                    }

                    if (tags && tags.indexOf(label) == -1) {
                      setValue("tags", [...tags, label]);
                      return;
                    }

                    setValue(
                      "tags",
                      tags?.filter((tag) => {
                        return tag != label;
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
              name="venue.venueName"
              rules={{
                required: "Venue Name is required",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Venue Name *"
                  value={value}
                  onChange={onChange}
                  placeholder="Venue Name"
                  size="md"
                  variant="bordered"
                  errorMessage={error?.message}
                  className="max-w-3xl"
                />
              )}
            />
            <Controller
              control={control}
              name="venue.address1"
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
              name="venue.address2"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Address 2"
                  value={value}
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
              name="venue.postalCode"
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
          name="maxAttendees"
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
                "name",
                "description",
                "startDateTime",
                "endDateTime",
                "maxAttendees",
              ]); // todo: add mroe validation
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
