import React, { useState } from "react";
import Accordion from "../components/Accordion";
import CollectionGrid from "../components/CollectionGrid";
import Avatar from "../components/Avatar";
import Banner from "../components/Banner";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Modal from "../components/Modal";
// import TabGroup from "../components/TabGroup";
import Toggle from "../components/Toggle";
import Input from "../components/Input";
import InputGroup from "../components/InputGroup";

import { FaGithub, FaPhone, FaEnvelope } from "react-icons/fa";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

import TabGroupBordered from "../components/TabGroupBordered";
import { communities, posts, products, profile } from "../utils/dummyData";
import Table from "../components/Table";
import TextArea from "../components/TextArea";
import AvatarInput from "../components/AvatarInput";
import BannerInput from "../components/BannerInput";
import Carousel from "../components/Carousel";
import Post from "../components/Post";
import PostInput from "../components/PostInput";
import CommunityGrid from "../components/CommunityGrid";

const PlaygroundPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [accordionIdx, setAccordionIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [value, setValue] = useState<string | number>("");
  const [textAreaContent, setTextAreaContent] = useState("");
  const [profilePic, setProfilePic] = useState<File>(null as unknown as File);
  const [bannerPic, setBannerPic] = useState<File>(null as unknown as File);

  return (
    <main className="min-h-screen bg-slate-50">
      <h1 className="mb-4 bg-gray-900 p-6 text-center text-3xl font-bold text-teal-300">
        Playground
      </h1>

      {/* Profile header */}
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="mb-4 inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Profile Header (Banner + Profile Pic)
          </h1>
        </div>
        <Banner coverImageUrl={profile.coverImageUrl} />
        <div>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <Avatar imageUrl={profile.imageUrl} />
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                {/* mobile view profile name*/}
                <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {profile.name} - mobile
                  </h1>
                </div>
                <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Button variant="outlined" size="md">
                    <FaEnvelope
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Message
                  </Button>
                  <Button variant="outlined" size="md">
                    <FaPhone
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Call
                  </Button>
                </div>
              </div>
            </div>
            {/* desktop view profile name*/}
            <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {profile.name} - desktop
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Input and Input Groups */}
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="mb-4 inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Input component Text: {value}
          </h1>
        </div>
        <Input
          type="text"
          size="md"
          variant="bordered"
          label="text input"
          placeholder="placeholder"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <InputGroup
          type="text"
          size="md"
          // addOn="$"
          variant="bordered"
          label="text input"
          placeholder="placeholder"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <FaGithub />
        </InputGroup>
      </section>

      <div className="divider" />
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="mb-4 inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Text Area component
          </h1>
        </div>
        <TextArea
          placeholder="I am a 22 years old Software Engineer currently based in San Francisco."
          value={textAreaContent}
          onChange={(e) => setTextAreaContent(e.target.value)}
        />
      </section>

      <div className="divider" />
      {/* Bordered Tab Group */}
      <div className="p-8">
        <div className="flex justify-center">
          <h1 className="inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Bordered Tab Group component
          </h1>
        </div>
        <div className="flex justify-center">
          <TabGroupBordered
            tabs={["Tab 1", "Tab 2", "Tab 3"]}
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab == 0 && <h1>Hi</h1>}
            {activeTab == 1 && <h1>My</h1>}
            {activeTab == 2 && <h1>Name</h1>}
          </TabGroupBordered>
        </div>
      </div>
      <div className="divider" />

      <div className="divider" />

      {/* Collection Grid */}
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="mb-4 inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Collection Grid
          </h1>
        </div>

        <CollectionGrid data={products} />
      </section>
      <div className="divider" />

      {/* Table */}
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="mb-4 inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Table
          </h1>
        </div>

        <Table
          data={[
            {
              name: "name",
              community: "community",
              tipAmount: 10,
              status: "Accepted",
            },
            {
              name: "name1",
              community: "community1",
              tipAmount: 100,
              status: "Pending",
            },
          ]}
          columns={["Name", "Tip Amount", "Status"]}
        />
      </section>

      <div className="divider" />

      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="mb-4 inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Accordion component
          </h1>
        </div>
        <Accordion
          id={0}
          idx={accordionIdx}
          setIdx={setAccordionIdx}
          title="Mary had a little lamb?"
        >
          <h1 className="rounded-sm bg-teal-100 p-8">Hello</h1>
        </Accordion>
        <Accordion
          id={1}
          idx={accordionIdx}
          setIdx={setAccordionIdx}
          title="And it was really cute?"
        >
          <h1 className="rounded-sm bg-teal-100 p-8">World</h1>
        </Accordion>
      </section>
      <div className="divider" />
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="mb-4 inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Modal component
          </h1>
        </div>
        <div className="flex justify-center p-6">
          <button
            className="btn-outline btn"
            onClick={() => setIsModalOpen(true)}
          >
            Open modal
          </button>
        </div>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          <h1 className="text-lg font-medium leading-6 text-gray-900">
            Payment successful
          </h1>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Your payment has been successfully submitted. We’ve sent you an
              email with all of the details of your order.
            </p>
          </div>

          <div className="mt-4">
            <button
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => setIsModalOpen(false)}
            >
              Got it, thanks!
            </button>
          </div>
        </Modal>
      </section>
      <div className="divider" />
      {/* <section className="p-8">
        <div className="flex justify-center">
          <h1 className="inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Tab group component
          </h1>
        </div>
        <div className="flex justify-center">
          <TabGroup
            tabs={["Tab 1", "Tab 2", "Tab 3", "Tab 69"]}
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab == 0 && <h1>Hi</h1>}
            {activeTab == 1 && <h1>My</h1>}
            {activeTab == 2 && <h1>Name</h1>}
            {activeTab == 3 && <h1>Jeff</h1>}
          </TabGroup>
        </div>
      </section> */}
      <div className="divider" />
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Toggle component
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <Toggle isChecked={showWord} setIsChecked={setShowWord} />

          <div className="inline-block h-10">
            <p className="">
              Word of the day:{" "}
              <span className="text- inline-block w-32 rounded bg-orange-200 p-2 text-center font-bold text-black/80">
                {showWord ? "Hello World" : "?????"}
              </span>
            </p>
          </div>
        </div>
      </section>
      <div className="divider" />
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Dropdown component
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <Dropdown />
        </div>
      </section>

      <div className="divider" />
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Avatar + Banner Input
          </h1>
        </div>
        <div className="p-8">
          <BannerInput
            bannerPic={bannerPic}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setBannerPic(e.target.files[0]);
              }
            }}
            onClick={() => setBannerPic(null as unknown as File)}
          />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative -mt-12 h-24 sm:-mt-16 sm:h-32">
              <AvatarInput
                profilePic={profilePic}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setProfilePic(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Carousel
          </h1>
        </div>
        <div className="p-8">
          <Carousel images={posts[0].media} />
        </div>
      </section>

      <div className="divider" />
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Post + Comment
          </h1>
        </div>
        <div className="p-8">
          <Post post={posts[0]} />
        </div>
      </section>

      <div className="divider" />
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Create Post
          </h1>
        </div>
        <div className="p-8">
          <PostInput createPost={() => {}} />
        </div>
      </section>

      <div className="divider" />
      <section className="p-8">
        <div className="flex justify-center">
          <h1 className="inline-block border-b-2 border-gray-300 py-1 text-xl font-bold">
            Community Grid
          </h1>
        </div>
        <div className="p-8">
          <CommunityGrid communities={communities} />
        </div>
      </section>
    </main>
  );
};

export default PlaygroundPage;
