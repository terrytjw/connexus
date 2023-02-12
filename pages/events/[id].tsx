import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  FaBullseye,
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

const EventPage = () => {
  const router = useRouter();
  const { eid } = router.query;

  return (
    <div>
      <main>
        <div className="relative">
          <Banner
            coverImageUrl={
              "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            }
          />
        </div>

        <div className="z-30 mx-auto px-16">
          <div className="relative z-30 -mt-12 sm:-mt-16">
            <Avatar
              imageUrl={
                "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              }
            />
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
                    Marina Bay Sands 10 Bayfront Avenue Street, Singapore 018956
                  </p>
                </span>
              </div>
            </div>
          </section>

          <section>
            <TicketCard />
          </section>

          <section>
            <h1 className="mt-12 text-xl font-semibold sm:text-2xl">Topics</h1>
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
    </div>
  );
};

export default EventPage;

const TicketCard = () => {
  return (
    <div>
      <h1 className="mt-12 text-xl font-semibold sm:text-2xl ">
        Ticket Options (Types)
      </h1>
      <div className="py-4 sm:py-8">
        <div className="center card flex items-center justify-between gap-6 border-2 border-gray-200 bg-white p-6 lg:card-side">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-xl font-bold text-gray-700">Ticket Name</h1>
            <span>
              <p className="text-md font-semibold text-blue-600">Ticket Type</p>
              <p className="text-sn text-gray-700">Premium</p>
            </span>
            <span>
              <p className="text-md font-semibold text-blue-600">Price</p>
              <p className="text-sn text-gray-700">$999</p>
            </span>
            <span className="flex gap-4">
              <p className="text-md font-semibold text-gray-700">
                Sale Duration
              </p>
              <p className="text-sn text-gray-700">placeholder</p>
            </span>
            <span className="flex gap-4">
              <p className="text-md font-semibold text-gray-700">Event Date</p>
              <p className="text-sn text-gray-700">placeholder</p>
            </span>
            <span className="flex gap-4">
              <p className="text-md font-semibold text-gray-700">
                Event Location
              </p>
              <p className="text-sn text-gray-700">placeholder</p>
            </span>
            <span className="mt-6 flex flex-col gap-4">
              <p className="text-md text-blue-600">
                Perks of owning this ticket:
              </p>
              <p className="text-sn text-gray-700">• Access to...</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
