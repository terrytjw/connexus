import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

const ChatsPage = ({}) => {
  return (
    <ProtectedRoute>
      <Layout>
        <div>ChatsPage</div>
      </Layout>
    </ProtectedRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  console.log(session);
  // session?.user.
  return {
    props: {
      user: {
        // id : session?.walletAddress,
      },
    },
  };
};

export default ChatsPage;
