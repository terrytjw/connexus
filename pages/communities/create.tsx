import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import AvatarInput from "../../components/AvatarInput";
import Badge from "../../components/Badge";
import BannerInput from "../../components/BannerInput";
import Button from "../../components/Button";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import { Community } from "../../utils/dummyData";

type CreateCommunityPageProps = {
  community: Community;
};

const CreateCommunityPage = ({ community }: CreateCommunityPageProps) => {
  const router = useRouter();
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
      name: community ? community.name : "",
      description: community ? community.description : "",
      bannerPic: "",
      profilePic: "",
      maxMembers: community ? community.maxMembers : ("" as unknown as number),
      tags: community ? community.tags : ([] as string[]),
    },
  });
  const [bannerPic, profilePic, tags] = watch([
    "bannerPic",
    "profilePic",
    "tags",
  ]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data);
        router.push("/communities/1");
      })}
    >
      <main className="py-12 px-4 sm:px-12">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outlined"
            size="md"
            className="border-0"
            onClick={() => history.back()}
          >
            <FaChevronLeft />
          </Button>
          <div>
            <h2 className="text-4xl font-bold">
              {community ? "Edit " : ""}Community
            </h2>
            <h3 className="mt-4">
              {community
                ? "Update your community details"
                : "Set up a new community"}
            </h3>
          </div>
        </div>

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

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-12 h-24 sm:-mt-16 sm:h-32">
            <AvatarInput
              profilePic={profilePic}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const reader = new FileReader();
                  reader.addEventListener("load", () => {
                    setValue("profilePic", reader.result as string);
                  });
                  reader.readAsDataURL(e.target.files[0]);
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
              name="maxMembers"
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
                {community ? "Save Changes" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </form>
  );
};

export default CreateCommunityPage;
