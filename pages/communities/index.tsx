import { CategoryType } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FaSearch, FaTimes } from "react-icons/fa";
import useSWR from "swr";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import CommunityGrid from "../../components/CommunityPages/CommunityGrid";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import ProtectedRoute from "../../components/ProtectedRoute";
import TabGroupBordered from "../../components/TabGroupBordered";
import { UserRoleContext } from "../../contexts/UserRoleProvider";
import { CommunityWithMemberIds } from "../../utils/types";
import { getUserInfo } from "../../lib/api-helpers/user-api";
import {
  getAllCommunitiesAPI,
  searchCommunitiesAPI,
} from "../../lib/api-helpers/community-api";

type CommunitiesPagePageProps = {
  communitiesData: CommunityWithMemberIds[];
};

const CommunitiesPage = ({ communitiesData }: CommunitiesPagePageProps) => {
  const [communities, setCommunities] = useState(communitiesData);
  const [selectedTopics, setSelectedTopics] = useState<CategoryType[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user.userId;

  const { data: userData, error, isLoading } = useSWR(userId, getUserInfo);

  const searchAndFilterCommunities = async () => {
    const res = await searchCommunitiesAPI(searchString, 0, selectedTopics);
    setCommunities(res);
  };

  useEffect(() => {
    searchAndFilterCommunities();
  }, [searchString, selectedTopics]);

  const router = useRouter();
  const { isFan } = useContext(UserRoleContext);

  useEffect(() => {
    // currently in fan view, wants to switch to creator view
    // but setIsFan is asynchronous, so there may be a chance where isFan == false but localStorage.getItem("role") === "fan"
    // so have to check localstorage to ensure that role is actually creator before redirecting
    if (!isFan && localStorage.getItem("role") === "creator" && userData) {
      console.log("in index, redirecting to create/[id]...");
      router.replace(
        userData.createdCommunities.length > 0
          ? `/communities/${userData.createdCommunities[0].communityId}`
          : `/communities/create`
      );
    }
  }, [isFan]);

  if (isLoading) return <Loading />;

  return (
    <ProtectedRoute>
      <Layout>
        <Modal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          className="min-w-fit"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Filter Communities
            </h3>
            <Button
              variant="outlined"
              size="sm"
              className="border-0 text-red-500"
              onClick={() => {
                setSelectedTopics([]);
              }}
            >
              Clear
            </Button>
          </div>

          <h3 className="mt-8 text-sm font-medium text-gray-500">CATEGORIES</h3>
          <div className="mt-2 mb-4 grid grid-cols-1 justify-center gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Object.values(CategoryType).map((label, index) => {
              return (
                <Badge
                  key={index}
                  label={label}
                  size="md"
                  selected={
                    selectedTopics.length > 0 &&
                    selectedTopics.indexOf(label) != -1
                  }
                  onClick={() => {
                    if (selectedTopics.indexOf(label) == -1) {
                      setSelectedTopics([...selectedTopics, label]);
                      return;
                    }
                    setSelectedTopics(
                      selectedTopics.filter((topic) => {
                        return topic != label;
                      })
                    );
                  }}
                  className="h-8 w-full rounded-lg sm:w-32"
                />
              );
            })}
          </div>
          <Button
            variant="solid"
            size="md"
            className="mt-8"
            onClick={() => setIsModalOpen(false)}
          >
            Submit
          </Button>
        </Modal>

        <main className="py-12 px-4 sm:px-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Browse Communities
          </h2>
          <h3 className="mt-4 text-gray-500">
            Take a look at all these communities by other creators and join a
            community!
          </h3>

          {/* mobile */}
          {activeTab == 0 ? (
            <div className="mt-8 flex w-full gap-2 lg:hidden">
              <div className="relative w-full items-center justify-center rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="text-gray-500" />
                </div>
                <input
                  className="input-outlined input input-md block w-full rounded-md pl-10"
                  type="text"
                  value={searchString}
                  placeholder="Search Communities"
                  onChange={(e) => {
                    setSearchString(e.target.value);
                  }}
                />
              </div>
              <BiFilter
                className="h-12 w-10"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          ) : null}

          <div className="relative">
            <TabGroupBordered
              tabs={["All", "Joined"]}
              activeTab={activeTab}
              setActiveTab={(index: number) => {
                setActiveTab(index);
              }}
            >
              {activeTab == 0 && (
                <>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {selectedTopics.map((label, index) => {
                      return (
                        <Button
                          key={index}
                          size="sm"
                          variant="outlined"
                          onClick={(e) => e.preventDefault()}
                          className="font-normal"
                        >
                          {label}
                          <FaTimes
                            onClick={() => {
                              setSelectedTopics(
                                selectedTopics.filter((topic) => {
                                  return topic != label;
                                })
                              );
                            }}
                          />
                        </Button>
                      );
                    })}
                  </div>
                  <CommunityGrid communities={communities} />
                </>
              )}
              {activeTab == 1 && (
                <div className="mt-4">
                  <CommunityGrid
                    communities={userData.joinedCommunities}
                    joinedTab={true}
                  />
                </div>
              )}
            </TabGroupBordered>

            {/* desktop */}
            {activeTab == 0 ? (
              <div className="absolute right-0 top-8 hidden items-center gap-x-4 lg:flex">
                <div className="relative w-full items-center justify-center rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="text-gray-500" />
                  </div>
                  <input
                    className="input-outlined input input-md block w-full rounded-md pl-10"
                    type="text"
                    value={searchString}
                    placeholder="Search Communities"
                    onChange={(e) => {
                      setSearchString(e.target.value);
                    }}
                  />
                </div>
                <Button
                  variant="solid"
                  size="md"
                  className="max-w-sm !bg-white !text-gray-700 shadow-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  Filter
                  <BiFilter className="h-6 w-6" />
                </Button>
              </div>
            ) : null}
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default CommunitiesPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const communitiesData = await getAllCommunitiesAPI(0);

  return {
    props: {
      communitiesData,
    },
  };
};
