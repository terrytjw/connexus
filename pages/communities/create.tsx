import { Controller, useForm } from "react-hook-form";
import AvatarInput from "../../components/AvatarInput";
import Badge from "../../components/Badge";
import BannerInput from "../../components/BannerInput";
import Button from "../../components/Button";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";

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
      bannerPic: null as unknown as File,
      profilePic: null as unknown as File,
      maxMember: "" as unknown as number,
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

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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

          <div className="mt-8 max-w-3xl">
            <Controller
              control={control}
              name="name"
              rules={{ required: "Community Name is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Community Name"
                  value={value}
                  onChange={onChange}
                  placeholder="Community Name"
                  size="md"
                  variant="bordered"
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              rules={{ required: "Community Description is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextArea
                  className="max-w-3xl"
                  label="Description"
                  placeholder="Tell us what your community is about"
                  value={value}
                  onChange={onChange}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="tags"
              rules={{
                validate: (value) =>
                  value.length > 0 || "Please select at least one topic",
              }}
              render={({ fieldState: { error } }) => (
                <div className="form-control w-full">
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
                      {error?.message}
                    </span>
                  </label>
                </div>
              )}
            />

            <Controller
              control={control}
              name="maxMember"
              rules={{
                required: "Maximum Number of Members is required",
                validate: (value) =>
                  value > 0 || "Minimum Number of Members is 1",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="number"
                  label="Maximum Number of Members"
                  value={value}
                  onChange={onChange}
                  placeholder="Maximum Number of Members"
                  size="md"
                  variant="bordered"
                  errorMessage={error?.message}
                />
              )}
            />

            <div className="mt-8">
              <Button variant="solid" size="md">
                <input type="submit" className="hidden" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </main>
    </form>
  );
};

export default CreateCommunityPage;
