import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";

const ChatsPage = ({}) => {
  return <div>ChatsPage</div>;
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
