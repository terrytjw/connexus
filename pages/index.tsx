import type { NextPage } from "next";
import Head from "next/head";
import { FaGithub, FaShareSquare } from "react-icons/fa";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { useState } from "react";
import Notification from "../components/Notification";
import CollectionItemInput from "../components/CollectionItemInput";
import "@biconomy/web3-auth/dist/src/style.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type Item = {
  image: string;
  description: string;
  quantity: number;
};
const HomePage: NextPage = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(false);
  const [items, setItems] = useState([
    { image: "", description: "", quantity: 1 },
  ]);

  const { data: session, status } = useSession();
  console.log("session [HOME PAGE] -> ", session);

  return (
    <div>
      <Head>
        <title>Home | Connexus</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center p-10 tracking-widest">
        <h1 className="animate-pulse text-3xl font-bold">Let's build. 🚀</h1>

        <h2 className="mt-10 mb-6 text-xl font-semibold">Authentication</h2>

        <section className="mb-8 flex flex-wrap gap-4">
          <Button variant="solid" size="md" className="mt-4" href="/auth">
            Login
          </Button>
        </section>

        <div className="divider" />

        <h2 className="mt-10 mb-6 text-xl font-semibold">
          Components showcase
        </h2>

        <div className="divider" />

        {/* <CustomLink
          href="https://github.com/terrytjw/t2-template"
          className="flex gap-4 p-8"
        >
          <FaGithub />
          Github repo
        </CustomLink> */}
        <h3 className="font-bold">Buttons</h3>
        <section className="mb-8 flex flex-wrap gap-4">
          <Button variant="solid" size="md" className="mt-4">
            <FaGithub />
            Github repo
          </Button>
          <Button variant="solid" size="md" className="mt-4">
            Github repo
          </Button>
          <Button variant="outlined" size="md" className="mt-4">
            <FaGithub />
            Github repo
          </Button>
          <Button variant="outlined" size="md" className="mt-4">
            Github repo
          </Button>
        </section>
        <section className="flex gap-4">
          <Button variant="solid" size="md" className="rounded-full">
            <FaShareSquare />
          </Button>
          <Button variant="outlined" size="md" className="rounded-full">
            <FaShareSquare />
          </Button>
        </section>
        <div className="divider" />
        <h3 className="font-bold">Badges</h3>
        <section className="mt-4 flex flex-wrap items-center gap-4">
          <Badge size="lg" label="NFT" />
          <Badge
            size="lg"
            label="Entertainment"
            selected={selected}
            onClick={() => {
              setSelected(!selected);
            }}
          />
        </section>
        <div className="divider" />
        <h3 className="font-bold">Notifications</h3>
        <section className="mt-4 flex w-full flex-col flex-wrap">
          <Notification
            userId="1"
            userProfilePic=""
            userName="Fan name"
            message="has sent you a message! Let's chat!"
            linkLabel="Go to chat room #1"
            href="chats"
          />
          <div className="card border-2 border-gray-200 bg-white">
            <ul role="list" className="divide-y divide-gray-200">
              <li>
                <Notification
                  userId="1"
                  userProfilePic=""
                  userName="Creator name #1"
                  message="has rejected your chat request."
                />
              </li>
              <li>
                <Notification
                  message="Please be reminded that event will start in 2 days!"
                  linkLabel="Go to event details"
                  href="events"
                />
              </li>
            </ul>
          </div>
        </section>
        <div className="divider" />
        <h3 className="font-bold">Collection Item Input</h3>
        <section className="mt-4 flex flex-wrap items-center gap-4">
          <Button
            variant="outlined"
            size="md"
            className="rounded-full"
            onClick={() => {
              console.log(items);
            }}
          >
            View items in console
          </Button>
          <Button
            variant="outlined"
            size="md"
            className="rounded-full"
            onClick={() => {
              setItems([...items, { image: "", description: "", quantity: 1 }]);
            }}
          >
            Add item
          </Button>
        </section>
        <section className="mt-4 flex flex-row flex-wrap justify-center gap-4 lg:flex-col">
          {items.map((item, index) => (
            <CollectionItemInput
              key={index}
              item={item}
              updateItem={(updatedItem: Item) => {
                setItems(
                  items.map((item1, index1) =>
                    // need to compare index in order to update current item
                    index == index1 ? updatedItem : item1
                  )
                );
              }}
              deleteItem={() => {
                setItems(
                  items.filter((item1) => {
                    return item1 != item;
                  })
                );
              }}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
