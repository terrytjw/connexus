import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import CreatorCommunityPage from "../../components/CommunityPages/Creator/CreatorCommunityPage";
import FanCommunityPage from "../../components/CommunityPages/Fan/FanCommunityPage";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { CommunityWithCreatorAndChannelsAndMembers } from "../../utils/types";
import { getCommunityAPI } from "../../lib/api-helpers/community-api";
import {
  CollectionWithMerchAndPremiumChannel,
  getLinkedCollections,
} from "../../lib/api-helpers/collection-api";

type CommunityPagePageProps = {
  communityData: CommunityWithCreatorAndChannelsAndMembers;
  linkedCollections: CollectionWithMerchAndPremiumChannel[];
};

const CommunityPage = ({
  communityData,
  linkedCollections,
}: CommunityPagePageProps) => {
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
          <FanCommunityPage
            community={community}
            setCommunity={setCommunity}
            linkedCollections={linkedCollections}
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default CommunityPage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { id } = context.params;

  const communityData = await getCommunityAPI(id);

  if (communityData && Object.keys(communityData).length === 0) {
    return {
      redirect: {
        destination: "/communities",
        permanent: false,
      },
    };
  }

  const linkedCollections = await getLinkedCollections(
    communityData.creator.userId
  );

  return {
    props: {
      communityData,
      linkedCollections,
    },
  };
};
