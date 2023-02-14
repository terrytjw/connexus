import React from "react";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const EventsPage = () => {
  return <div>EventsPage</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  console.log(session);
  return {
    props: {},
  };
};

export default EventsPage;
