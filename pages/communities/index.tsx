import { useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import CommunityGrid from "../../components/CommunityPages/CommunityGrid";
import Modal from "../../components/Modal";
import TabGroupBordered from "../../components/TabGroupBordered";
import { communities } from "../../utils/dummyData";

const CommunitiesPage = () => {
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
    "Food",
    "Photography",
  ];
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <div className="flex items-center justify-between">
          <h3 className="ml-2 text-xl font-semibold">Add Topics</h3>
          <Button
            variant="outlined"
            size="sm"
            className="border-0"
            onClick={() => setIsModalOpen(false)}
          >
            Done
          </Button>
        </div>

        <div className="mt-8 mb-4 grid grid-cols-1 justify-center gap-4 sm:grid-cols-2">
          {labels.map((label, index) => {
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
                className="h-8 w-full sm:w-48"
              />
            );
          })}
        </div>
      </Modal>

      <main className="py-12 px-4 sm:px-12">
        <h2 className="text-4xl font-bold">Communities</h2>

        {/* mobile */}
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

        <div className="relative">
          <TabGroupBordered
            tabs={["All", "Joined"]}
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab == 0 && <CommunityGrid communities={communities} />}
            {activeTab == 1 && <CommunityGrid communities={communities} />}
          </TabGroupBordered>

          {/* desktop */}
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
        </div>
      </main>
    </div>
  );
};

export default CommunitiesPage;
