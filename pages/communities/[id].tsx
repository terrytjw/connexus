import axios from "axios";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import CreatorCommunityPage from "../../components/CommunityPages/Creator/CreatorCommunityPage";
import FanCommunityPage from "../../components/CommunityPages/Fan/FanCommunityPage";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { CommunityWithCreatorAndChannelsAndMembers } from "../../utils/types";

type CommunityPagePageProps = {
  communityData: CommunityWithCreatorAndChannelsAndMembers;
};

const CommunityPage = ({ communityData }: CommunityPagePageProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const [community, setCommunity] = useState(communityData);

  return (
    <ProtectedRoute>
      <Layout>
        {community.userId == userId ? (
          <CreatorCommunityPage
            community={community}
            setCommunity={setCommunity}
          />
        ) : (
          <FanCommunityPage community={community} setCommunity={setCommunity} />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default CommunityPage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { id } = context.params;

  const { data: communityData } = await axios.get(
    `http://localhost:3000/api/community/${id}`
  );

  if (communityData && Object.keys(communityData).length === 0) {
    return {
      redirect: {
        destination: "/communities",
        permanent: false,
      },
    };
  }

  return {
    props: {
      communityData,
    },
  };
};
