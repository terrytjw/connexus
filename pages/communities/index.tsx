import { CategoryType } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FaSearch, FaTimes } from "react-icons/fa";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import CommunityGrid from "../../components/CommunityPages/CommunityGrid";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import ProtectedRoute from "../../components/ProtectedRoute";
import TabGroupBordered from "../../components/TabGroupBordered";
import useSWR from "swr";
import { swrFetcher } from "../../lib/swrFetcher";
import { CommunityWithMemberIds } from "../../utils/types";

type CommunitiesPagePageProps = {
  communitiesData: CommunityWithMemberIds[];
};

const CommunitiesPage = ({ communitiesData }: CommunitiesPagePageProps) => {
  const [communities, setCommunities] = useState(communitiesData);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const {
    data: userData,
    error,
    isLoading,
  } = useSWR(`http://localhost:3000/api/users/${userId}`, swrFetcher);

  const searchAndFilterCommunities = async () => {
    let url = "http://localhost:3000/api/community";

    if (searchString) {
      url = url + `?keyword=${searchString}`;
      selectedTopics.forEach((topic) => (url = url + `&filter=${topic}`));
    } else {
      if (selectedTopics.length > 0) {
        selectedTopics.forEach((topic, index) => {
          if (index == 0) {
            url = url + `?filter=${topic}`;
          } else {
            url = url + `&filter=${topic}`;
          }
        });
      }
    }

    const res = await axios.get(url);
    const temp = res.data;
    setCommunities(temp);
  };

  useEffect(() => {
    searchAndFilterCommunities();
  }, [searchString, selectedTopics]);

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
            <h3 className="ml-2 text-xl font-semibold">Add Topics</h3>
            <Button
              variant="outlined"
              size="sm"
              className="border-0"
              onClick={() => {
                setIsModalOpen(false);
                searchAndFilterCommunities();
              }}
            >
              Done
            </Button>
          </div>

          <div className="mt-8 mb-4 grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(CategoryType).map((label, index) => {
              return (
                <Badge
                  key={index}
                  label={label}
                  size="lg"
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
                  className="h-8 w-full sm:w-56"
                />
              );
            })}
          </div>
          <Button
            variant="outlined"
            size="sm"
            className="mt-8 w-full text-red-500"
            onClick={() => {
              setSelectedTopics([]);
            }}
          >
            Clear selected topics
          </Button>
        </Modal>

        <main className="py-12 px-4 sm:px-12">
          <h2 className="text-4xl font-bold">Communities</h2>

          {/* mobile */}
          {activeTab == 0 ? (
            <div className="mt-8 flex w-full gap-2 lg:hidden">
              <div className="relative w-full items-center justify-center rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch />
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
                    {selectedTopics.map((label) => {
                      return (
                        <Button
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
                <CommunityGrid
                  communities={userData.joinedCommunities}
                  joinedTab={true}
                />
              )}
            </TabGroupBordered>

            {/* desktop */}
            {activeTab == 0 ? (
              <div className="absolute right-0 top-8 hidden items-center gap-x-4 lg:flex">
                <div className="relative w-full items-center justify-center rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch />
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
                  className="max-w-sm !bg-white !text-gray-700"
                  onClick={() => setIsModalOpen(true)}
                >
                  Filter by Topic
                  <BiFilter className="h-8 w-8" />
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
  const { data: communitiesData } = await axios.get(
    `http://localhost:3000/api/community`
  );

  return {
    props: {
      communitiesData,
    },
  };
};
