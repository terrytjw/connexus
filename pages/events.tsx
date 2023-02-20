import React from "react";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

const EventsPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div>EventsPage</div>
      </Layout>
    </ProtectedRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  console.log(session);
  return {
    props: {},
  };
};

export default EventsPage;
