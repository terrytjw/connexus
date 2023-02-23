import TicketCard from "../../components/EventPages/TicketCard";
import { useRouter } from "next/router";
import React from "react";
import {
  FaCalendar,
  FaFacebook,
  FaFacebookMessenger,
  FaInstagram,
  FaMapPin,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import Avatar from "../../components/Avatar";
import Badge from "../../components/Badge";
import Banner from "../../components/Banner";
import Button from "../../components/Button";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";

const EventPage = () => {
  const router = useRouter();
  const { eid } = router.query;

  return (
    <ProtectedRoute>
      <Layout>
        <main>
          <div className="relative">
            <Banner coverImageUrl={"/images/bear.jpg"} />
          </div>

          <div className="z-30 mx-auto px-16">
            <div className="relative z-30 -mt-12 sm:-mt-16">
              <Avatar imageUrl={"/images/bear.jpg"} />
            </div>
          </div>

          <div className="py-8 px-4 sm:px-12">
            <section>
              <div className="mt-4 flex flex-wrap justify-between">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold sm:text-4xl">Event Name</h1>
                  <h3 className="mt-4">Description </h3>
                </div>
                <Button variant="solid" size="md" className="max-w-xs">
                  Register for event
                </Button>
              </div>
            </section>

            <section>
              <h1 className="mt-12 text-xl font-semibold sm:text-2xl">
                When and Where
              </h1>
              <div className="mt-8 flex justify-between">
                <div className="flex w-1/2">
                  <FaCalendar className="text-md" />
                  <span className="sm:text-md ml-2 flex-col text-sm">
                    <p className="font-bold">Date and Time</p>
                    <p>
                      Day, DD MM YYYY, 10:00 AM - Day, DD MM YYYY, 6:00 PM
                      Singapore Standard Time Singapore Time
                    </p>
                  </span>
                </div>

                <div className="flex w-1/2">
                  <FaMapPin className="text-md" />
                  <span className="sm:text-md ml-2 flex-col text-sm">
                    <p className="font-bold">Location</p>
                    <p>
                      Marina Bay Sands 10 Bayfront Avenue Street, Singapore
                      018956
                    </p>
                  </span>
                </div>
              </div>
            </section>

            <section>{/* <TicketCard {} /> */}</section>

            <section>
              <h1 className="mt-12 text-xl font-semibold sm:text-2xl">
                Topics
              </h1>
              <div className="flex flex-wrap gap-6 py-4">
                <Badge
                  className="text-white"
                  label="NFT"
                  size="lg"
                  selected={false}
                />
                <Badge
                  className="text-white"
                  label="NFT"
                  size="lg"
                  selected={false}
                />
                <Badge
                  className="text-white"
                  label="NFT"
                  size="lg"
                  selected={false}
                />
              </div>
            </section>

            <section>
              <h1 className="mt-12 text-xl font-semibold sm:text-2xl">
                Share through Social Media
              </h1>
              <div className="flex flex-wrap gap-4 py-4">
                <FaFacebook />
                <FaTwitter />
                <FaInstagram />
                <FaFacebookMessenger />
                <FaTelegram />
              </div>
            </section>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default EventPage;
