import { CategoryType } from "@prisma/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-hot-toast";
import AvatarInput from "../../components/AvatarInput";
import Badge from "../../components/Badge";
import BannerInput from "../../components/BannerInput";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import ProtectedRoute from "../../components/ProtectedRoute";
import TextArea from "../../components/TextArea";
import { UserRoleContext } from "../../contexts/UserRoleProvider";
import {
  createCommunityAPI,
  updateCommunityAPI,
  deleteCommunityAPI,
} from "../../lib/api-helpers/community-api";
import { getUserInfo } from "../../lib/api-helpers/user-api";
import { CommunityWithCreatorAndChannelsAndMembers } from "../../utils/types";
import { authOptions } from "../api/auth/[...nextauth]";

type CreateCommunityPageProps = {
  community: CommunityWithCreatorAndChannelsAndMembers;
};

const CreateCommunityPage = ({ community }: CreateCommunityPageProps) => {
  const { data: session } = useSession();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [communityId, setCommunityId] = useState(
    community ? community.communityId : (null as unknown as number)
  );

  const content = [
    {
      title: "Community Created!",
      description:
        "Your community page can be viewed in the ‘Community’ tab in the navigation bar.",
    },
    {
      title: "Community Updated!",
      description: "Your community page has been successfully updated.",
    },
    {
      title: "Community Deleted",
      description: "Your community has been successfully deleted.",
    },
    {
      title: "Community cannot be deleted",
      description:
        "This community cannot be deleted because it has one or more existing premium channels.",
    },
  ];

  const [modalContent, setModalContent] = useState(content[0]);

  type CommunityForm = {
    communityId?: number;
    name: string;
    description: string;
    bannerPic: string;
    profilePic: string;
    maxMembers: number;
    tags: CategoryType[];
    userId?: number;
  };

  const { handleSubmit, setValue, control, watch } = useForm<CommunityForm>({
    defaultValues: {
      name: community ? community.name : "",
      description: community ? (community.description as string) : "",
      profilePic: community ? (community.profilePic as string) : "",
      bannerPic: community ? (community.bannerPic as string) : "",
      tags: community ? community.tags : ([] as CategoryType[]),
      maxMembers: community ? community.maxMembers : ("" as unknown as number),
    },
  });

  const [bannerPic, profilePic, tags] = watch([
    "bannerPic",
    "profilePic",
    "tags",
  ]);

  const onCreate = async (formData: CommunityForm) => {
    if (!(profilePic && bannerPic)) {
      toast.error("Images are required!");
      return;
    }

    setModalContent(content[0]);
    setIsModalOpen(true);
    setIsLoading(true);

    const userId = Number(session?.user.userId);
    const createCommunityParams = {
      ...formData,
      maxMembers: Number(formData.maxMembers),
      userId: userId,
    };
    const res = await createCommunityAPI(createCommunityParams);

    setCommunityId(res[0].communityId);
    setIsLoading(false);
  };

  const onEdit = async (formData: CommunityForm) => {
    if (!(profilePic && bannerPic)) {
      toast.error("Images are required!");
      return;
    }

    setModalContent(content[1]);
    setIsModalOpen(true);
    setIsLoading(true);

    const updateCommunityParams = {
      ...formData,
      maxMembers: Number(formData.maxMembers),
      communityId: community.communityId,
    };
    await updateCommunityAPI(updateCommunityParams);

    setIsLoading(false);
  };

  const onDelete = async () => {
    // community has existing prem channel, cannot be deleted
    if (community.channels.length > 1) {
      setIsDeleteModalOpen(false);
      setModalContent(content[3]);
      setIsModalOpen(true);
    } else {
      setIsDeleteModalOpen(false);
      setModalContent(content[2]);
      setIsModalOpen(true);
      setIsLoading(true);

      await deleteCommunityAPI(community.communityId);

      setIsLoading(false);
    }
  };

  const router = useRouter();
  const { isFan } = useContext(UserRoleContext);

  useEffect(() => {
    // currently in creator view, wants to switch to fan view
    // but setIsFan is asynchronous, so there may be a chance where isFan == true but localStorage.getItem("role") === "creator"
    // so have to check localstorage to ensure that role is actually fan before redirecting
    if (
      isFan &&
      localStorage.getItem("role") === "fan" &&
      router.asPath.includes("create")
    ) {
      console.log("in create, redirecting to index...");
      router.replace("/communities");
    }
  }, [isFan]);

  return (
    <ProtectedRoute>
      <Layout>
        <form onSubmit={handleSubmit(!community ? onCreate : onEdit)}>
          <Modal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen}>
            <div className="flex flex-col gap-6 text-gray-900">
              <h3 className="text-xl font-semibold">Delete Community</h3>

              <p>
                By deleting this community, all existing data will be removed.{" "}
                <span className="font-semibold">
                  You cannot undo this action.
                </span>
              </p>

              <div className="flex gap-4">
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  variant="solid"
                  size="md"
                  onClick={() => onDelete()}
                >
                  Delete
                </Button>
                <Button
                  className="border-0"
                  variant="outlined"
                  size="md"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>

          <Modal isOpen={isModalOpen} setIsOpen={() => {}}>
            {isLoading ? (
              <Loading className="!h-full" />
            ) : (
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {modalContent.title}
                </h3>

                <p className="text-gray-500">{modalContent.description}</p>

                <div className="flex gap-4">
                  {modalContent.title == content[3].title ? (
                    <Button
                      variant="solid"
                      size="md"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Confirm
                    </Button>
                  ) : (
                    <Button
                      variant="solid"
                      size="md"
                      href={
                        modalContent.title == content[2].title
                          ? isFan
                            ? "/communities"
                            : `/communities/create`
                          : `/communities/${communityId}`
                      }
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Modal>

          <main className="py-12 px-4 sm:px-12">
            <div className="mb-8 flex items-center gap-4">
              {community ? (
                <Button
                  className="border-0"
                  variant="outlined"
                  size="md"
                  type="button"
                  onClick={() => history.back()}
                >
                  <FaChevronLeft />
                </Button>
              ) : null}

              <div>
                <h2 className="text-4xl font-bold text-gray-900">
                  {community ? "Edit " : ""}Community
                </h2>
                <h3 className="mt-4 text-gray-500">
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
                      errorMessage={error?.message}
                      size="md"
                      variant="bordered"
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
                      placeholder="Tell us what your community is about"
                      label="Description"
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
                        <span className="label-text">
                          Topics of Your Community
                        </span>
                      </label>

                      <div className="input-bordered input flex h-fit flex-wrap gap-4 bg-white p-4">
                        {Object.values(CategoryType).map((label, index) => {
                          return (
                            <Badge
                              key={index}
                              size="lg"
                              label={label}
                              selected={
                                tags &&
                                tags.length > 0 &&
                                tags.indexOf(label) != -1
                              }
                              onClick={() => {
                                if (!tags) {
                                  setValue("tags", [tags]);
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
                      errorMessage={error?.message}
                      size="md"
                      variant="bordered"
                    />
                  )}
                />

                <div className="mt-8 flex w-full flex-wrap gap-4">
                  {community ? (
                    <>
                      <Button
                        className="w-full sm:w-fit"
                        variant="solid"
                        size="md"
                        disabled={isLoading}
                      >
                        Save Changes
                      </Button>
                      <Button
                        className="w-full !text-red-500 hover:border-red-500 hover:bg-red-100 sm:w-fit"
                        variant="outlined"
                        size="md"
                        type="button"
                        onClick={() => setIsDeleteModalOpen(true)}
                        disabled={isLoading}
                      >
                        Delete Community
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full sm:w-fit"
                      variant="solid"
                      size="md"
                      disabled={isLoading}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </form>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateCommunityPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = Number(session?.user.userId);

  const userData = await getUserInfo(userId);

  if (
    context.resolvedUrl.includes("create") &&
    userData.createdCommunities.length > 0
  ) {
    return {
      redirect: {
        destination: `/communities/${userData.createdCommunities[0].communityId}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
