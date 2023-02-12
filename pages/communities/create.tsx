import { Controller, useForm } from "react-hook-form";
import { FaCamera, FaTimes } from "react-icons/fa";
import Avatar from "../../components/Avatar";
import Badge from "../../components/Badge";
import Banner from "../../components/Banner";
import Button from "../../components/Button";
import Input from "../../components/Input";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CreateCommunityPage = () => {
  const labels = [
    "NFT",
    "Lifestyle",
    "Fitness",
    "Entertainment",
    "Fashion",
    "Animals",
    "Travel",
    "Education",
    "Health",
  ];
  const { handleSubmit, setValue, control, watch } = useForm({
    defaultValues: {
      name: "",
      description: "",
      bannerPic: null as unknown as File | null,
      profilePic: null as unknown as File,
      maxMember: null as unknown as number,
      tags: [] as string[],
    },
  });
  const [bannerPic, profilePic, tags] = watch([
    "bannerPic",
    "profilePic",
    "tags",
  ]);

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <main className="py-12 px-4 sm:px-12">
        <h2 className="text-4xl font-bold">Community</h2>
        <h3 className="mt-4 mb-8">Set up a new community</h3>
        <div className="relative h-32 w-full lg:h-48">
          {bannerPic ? (
            <Banner coverImageUrl={URL.createObjectURL(bannerPic)} />
          ) : null}
          <div
            className={classNames(
              "absolute top-0 flex h-32 w-full lg:h-48",
              bannerPic ? "bg-black opacity-60" : "bg-gray-200"
            )}
          ></div>

          <div className="absolute top-0 flex h-32 w-full items-center justify-center gap-6 lg:h-48">
            <label className="relative">
              <Button variant="solid" size="md" className="!btn-circle">
                <FaCamera />
              </Button>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg, video/mp4"
                className="btn-md btn-circle btn absolute top-0 z-10 cursor-pointer opacity-0"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setValue("bannerPic", e.target.files[0]);
                  }
                }}
              />
            </label>

            {bannerPic ? (
              <Button
                variant="solid"
                size="md"
                className="!rounded-full"
                onClick={() => {
                  setValue("bannerPic", null);
                }}
              >
                <FaTimes />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="z-10 mx-auto h-24 px-4 sm:h-32 sm:px-6 lg:px-8">
          <div className="relative z-10 -mt-12 h-fit sm:-mt-16">
            {profilePic ? (
              <Avatar imageUrl={URL.createObjectURL(profilePic)} />
            ) : null}
            <div
              className={classNames(
                "absolute top-0 flex h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32",
                profilePic ? "bg-black opacity-60" : "bg-gray-200"
              )}
            ></div>

            <div className="absolute top-0 flex h-24 w-24 items-center justify-center rounded-full ring-4 ring-white sm:h-32 sm:w-32">
              <label className="relative">
                <Button variant="solid" size="md" className="!rounded-full">
                  <FaCamera />
                </Button>
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg, video/mp4"
                  className="btn-md btn-circle btn absolute top-0 z-10 cursor-pointer opacity-0"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setValue("profilePic", e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col gap-2">
          <Controller
            control={control}
            name="name"
            rules={{ required: "Community Name is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                type="text"
                label="Community Name"
                value={value}
                onChange={onChange}
                placeholder="Community Name"
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
            rules={{ required: "Community Description is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="form-control w-full max-w-3xl">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="input-group textarea-bordered textarea w-full max-w-3xl"
                  placeholder="Tell us what your community is about"
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

          <div className="form-control w-full max-w-3xl">
            <label className="label">
              <span className="label-text">Topics of Your Community</span>
            </label>

            <div className="input-bordered input flex h-fit flex-wrap gap-4 p-4">
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
                {/* {tags.length === 0 ? "Please select at least one topic" : null} */}
              </span>
            </label>
          </div>

          <Controller
            control={control}
            name="maxMember"
            rules={{
              required: "Maximum Number of Members is required",
              validate: (value) =>
                value > 0 || "Minimum Number of Members is 1",
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                type="number"
                label="Maximum Number of Members"
                value={value}
                onChange={onChange}
                placeholder="Maximum Number of Members"
                size="md"
                variant="bordered"
                errorMessage={error?.message}
                className="max-w-3xl"
              />
            )}
          />

          <Button variant="solid" size="md" className="max-w-3xl">
            <input type="submit" className="hidden" />
            Submit
          </Button>
        </div>
      </main>
    </form>
  );
};

export default CreateCommunityPage;
