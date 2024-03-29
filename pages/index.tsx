import type { NextPage } from "next";
import Head from "next/head";
import Button from "../components/Button";
import { useContext, useState } from "react";
import "@biconomy/web3-auth/dist/src/style.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { getUserInfo } from "../lib/api-helpers/user-api";
import { UserRoleContext } from "../contexts/UserRoleProvider";
import useSWR from "swr";
import Image from "next/image";
import CustomLink from "../components/CustomLink";
import TabGroupBordered from "../components/TabGroupBordered";
import CardSwiper from "../components/LandingPage/CardSwiper";
import {
  analyticsCards,
  communityCards,
  eventCards,
  merchandiseCards,
  profileCards,
} from "../utils/landingPageCardsData";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import {
  cameAboutVariant,
  driveValueVariant,
  headerVariant,
  rotateFromRightVariant,
  showcaseVariant,
  subheaderVariant,
} from "../motionVariants/HomePage";
import DesktopProductCard from "../components/LandingPage/DesktopProductCard";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const HomePage: NextPage = () => {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { data: session, status } = useSession();
  const userId = session?.user.userId;

  const { isFan } = useContext(UserRoleContext);
  const { data: userData, error, isLoading } = useSWR(userId, getUserInfo);

  const SocialLoginDynamic = dynamic(
    () => import("../components/scw").then((res) => res.default),
    {
      ssr: false,
      loading: () => <Loading className="!h-full" />,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="debug-screens">
      <Head>
        <title>Home | Connexus</title>
        <meta
          name="description"
          content="Grow your authentic relationships with your fans through Connexus."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="overflow-hidden">
        <nav className="mx-auto flex max-w-7xl justify-center bg-white px-8 py-4 md:justify-between">
          <div className="md:hidden">
            <Image
              src="/svgs/mobile-connexus-logo.svg"
              alt="Connexus logo"
              width={35}
              height={35}
            />
          </div>
          <div className="hidden md:block">
            <Image
              src="/svgs/desktop-connexus-logo.svg"
              alt="Connexus logo"
              width={160}
              height={50}
            />
          </div>
          <div className="hidden md:flex md:gap-x-8 md:font-medium md:text-blue-500">
            <CustomLink className="hover:text-blue-400" href="#product">
              Product
            </CustomLink>
            <CustomLink className="hover:text-blue-400" href="#about-us">
              About Us
            </CustomLink>
          </div>
        </nav>

        {/* main hero section */}
        <div className="bg-gradient-to-b from-blue-600 via-blue-400 to-white">
          <div className="mx-auto max-w-7xl px-8 pt-4 lg:flex lg:gap-40 lg:py-40">
            {/* mobile hero section */}
            <section className="mx-auto mt-8 max-w-7xl">
              <motion.h1
                className="mb-4 text-3xl font-bold text-white lg:text-4xl"
                variants={headerVariant}
                initial="hidden"
                animate="visible"
              >
                Grow your authentic relationships with your fans through
                Connexus with{" "}
                <span className="block h-20 italic lg:h-auto">
                  <Typewriter
                    words={[
                      "Digital Ticket/Merchandise.",
                      "Transparent Marketplace.",
                      "Social Channels.",
                      "Fan Behavior Analytics.",
                    ]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={30}
                    delaySpeed={2000}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="mt-4 pb-4 text-xl font-semibold text-white/80 lg:mt-8"
                variants={subheaderVariant}
                initial="hidden"
                animate="visible"
              >
                All-in-one platform to empower creators to develop authentic
                relationships with their fans.
              </motion.p>
            </section>

            {/* Join our community section */}
            <section className="mx-auto max-w-7xl pt-12">
              <motion.div
                className="relative flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white/90 p-8 shadow-2xl lg:w-80"
                variants={rotateFromRightVariant}
                initial="hidden"
                animate="visible"
              >
                <div className="absolute -top-12 rounded-2xl p-4">
                  <Image
                    src="/svgs/joinCommunity.svg"
                    alt="Connexus logo"
                    width={64}
                    height={64}
                  />
                </div>
                <h2 className="mt-8 text-2xl font-bold">Join our community</h2>
                <div className="mt-4 mb-4 flex flex-wrap gap-4">
                  <Button
                    variant="solid"
                    size="md"
                    className="mt-3 px-20"
                    onClick={
                      session
                        ? isFan
                          ? () => router.push("/communities")
                          : userData.createdCommunities.length > 0
                          ? () =>
                              router.push(
                                `/communities/${userData.createdCommunities[0].communityId}`
                              )
                          : () => router.push("/communities/create")
                        : () => setIsAuthModalOpen(true)
                    }
                  >
                    Login
                  </Button>
                  <Modal
                    isOpen={isAuthModalOpen}
                    setIsOpen={setIsAuthModalOpen}
                  >
                    <SocialLoginDynamic isAuthModalOpen={isAuthModalOpen} />
                  </Modal>
                </div>
              </motion.div>
            </section>
          </div>
        </div>

        {/* Explore our product section */}
        <section id="product" className="mx-auto max-w-7xl px-8 pt-32 lg:py-40">
          <motion.h2
            className="text-center text-2xl font-bold lg:text-3xl"
            variants={headerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Explore our product
          </motion.h2>
          <motion.p
            className="mt-8 text-center text-gray-500"
            variants={subheaderVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Manage every aspect of your authentic relationships with your fans
            in one secure platform.
          </motion.p>
          <motion.span
            variants={showcaseVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <TabGroupBordered
              tabs={[
                "Events",
                "Community",
                "Merchandise",
                "Analytics",
                "Profile",
              ]}
              activeTab={activeTab}
              setActiveTab={(index: number) => {
                setActiveTab(index);
              }}
            >
              {activeTab == 0 && (
                <>
                  <div className="lg:hidden">
                    <CardSwiper cards={eventCards} />
                  </div>
                  <div className="hidden lg:flex">
                    {eventCards.map((card, index) => (
                      <DesktopProductCard key={index} card={card} />
                    ))}
                  </div>
                </>
              )}
              {activeTab == 1 && (
                <>
                  <div className="lg:hidden">
                    <CardSwiper cards={communityCards} />
                  </div>
                  <div className="hidden lg:flex">
                    {communityCards.map((card, index) => (
                      <DesktopProductCard key={index} card={card} />
                    ))}
                  </div>
                </>
              )}
              {activeTab == 2 && (
                <>
                  <div className="lg:hidden">
                    <CardSwiper cards={merchandiseCards} />
                  </div>
                  <div className="hidden lg:flex">
                    {merchandiseCards.map((card, index) => (
                      <DesktopProductCard key={index} card={card} />
                    ))}
                  </div>
                </>
              )}
              {activeTab == 3 && (
                <>
                  <div className="lg:hidden">
                    <CardSwiper cards={analyticsCards} />
                  </div>
                  <div className="hidden lg:flex">
                    {analyticsCards.map((card, index) => (
                      <DesktopProductCard key={index} card={card} />
                    ))}
                  </div>
                </>
              )}
              {activeTab == 4 && (
                <>
                  <div className="lg:hidden">
                    <CardSwiper cards={profileCards} />
                  </div>
                  <div className="hidden lg:flex">
                    {profileCards.map((card, index) => (
                      <DesktopProductCard key={index} card={card} />
                    ))}
                  </div>
                </>
              )}
            </TabGroupBordered>
          </motion.span>
        </section>

        {/* About us section */}
        <motion.section
          id="about-us"
          className="relative bg-gradient-to-b from-white via-blue-100 to-[#87DBFF]"
          variants={headerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className={classNames("mx-auto max-w-7xl px-4 pt-16 lg:py-40")}>
            <motion.h2
              className="text-center text-2xl font-bold lg:text-3xl"
              variants={headerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              About us
            </motion.h2>
            <motion.p
              className="py-8 text-center text-3xl font-extrabold leading-[3.5rem] tracking-wide lg:text-5xl lg:leading-[4.5rem]"
              variants={showcaseVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Our Mission is to empower creators to{" "}
              <span className="text-blue-500">
                develop authentic relationships
              </span>{" "}
              with their fans.
            </motion.p>
          </div>
          <div className="absolute">
            <Image
              src="/images/landing-bg-wave.png"
              alt="wave image"
              width={3000}
              height={500}
            />
          </div>
        </motion.section>

        {/* Misc section */}
        <section className="lg: mx-auto max-w-7xl px-8 pt-24 lg:pt-60 lg:pb-24">
          <motion.div
            className="flex flex-col lg:flex-row lg:items-center lg:gap-x-12"
            variants={cameAboutVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold">How Connexus came about</h3>
              <p className="py-4 text-gray-500">
                The idea for Connexus originated in 2023, when our founding
                members sought to provide a common channel of outreach between
                creators and fans, be it through events, merchandise or even
                social communities to interact together.
              </p>
            </div>
            <div className="rounded-md p-4 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <Image
                src="/images/connexus-landing-demo-one.jpg"
                alt="Connexus logo"
                width={800}
                height={800}
              />
            </div>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-col lg:flex-row-reverse lg:items-center lg:gap-x-12"
            variants={driveValueVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-center lg:text-right">
              <h3 className="text-2xl font-bold">How we drive value</h3>
              <p className="py-4 text-gray-500">
                Using blockchain technology, Connexus enables the exchange of
                event tickets and digital merchandise, a token-gated community
                channel exclusive to creators and fans to be transparent and the
                traceability of data shared across a business network. 
              </p>
            </div>
            <div className="rounded-md p-4 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <Image
                src="/images/connexus-landing-demo-two.jpg"
                alt="Connexus logo"
                width={800}
                height={800}
              />
            </div>
          </motion.div>
        </section>

        <footer className="mt-20 flex flex-col items-center gap-y-4 bg-sky-100 py-12">
          <div className="">
            <Image
              src="/svgs/desktop-connexus-logo.svg"
              alt="Connexus logo"
              width={140}
              height={50}
            />
          </div>
          <p className="text-center text-gray-500">
            For Creators to Develop Authentic Relationships with Their Fans.
          </p>
          <p className="text-xs text-gray-500">
            © 2023 Connexus. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
