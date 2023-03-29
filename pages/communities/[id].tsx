import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import CreatorCommunityPage from "../../components/CommunityPages/Creator/CreatorCommunityPage";
import FanCommunityPage from "../../components/CommunityPages/Fan/FanCommunityPage";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { UserRoleContext } from "../../contexts/UserRoleProvider";
import { CommunityWithCreatorAndChannelsAndMembers } from "../../utils/types";
import { getCommunityAPI } from "../../lib/api-helpers/community-api";
import {
  CollectionWithMerchAndPremiumChannel,
  getLinkedCollections,
} from "../../lib/api-helpers/collection-api";
import { getUserInfo } from "../../lib/api-helpers/user-api";

type CommunityPagePageProps = {
  communityData: CommunityWithCreatorAndChannelsAndMembers;
  linkedCollections: CollectionWithMerchAndPremiumChannel[];
};

const CommunityPage = ({
  communityData,
  linkedCollections,
}: CommunityPagePageProps) => {
  const { data: session } = useSession();
  const userId = session?.user.userId;

  const [community, setCommunity] = useState(communityData);

  const { data: userData } = useSWR(userId, getUserInfo);

  const router = useRouter();
  const { isFan } = useContext(UserRoleContext);

  useEffect(() => {
    // currently in creator view, wants to switch to fan view
    // if community creator != current user, then there is no need to navigate
    // if community creator == current user, then need to navigate to /communities
    if (
      isFan &&
      localStorage.getItem("role") === "fan" &&
      community.userId == Number(userId)
    ) {
      router.replace("/communities");
    }

    // currently in fan view, wants to switch to creator view
    // if community creator == current user, then there is no need to navigate
    // if community creator != current user, then need to navigate to /communities/[id] or /communities/create
    if (
      !isFan &&
      localStorage.getItem("role") === "creator" &&
      community.userId != Number(userId) &&
      userData
    ) {
      router.replace(
        userData.createdCommunities.length > 0
          ? `/communities/${userData.createdCommunities[0].communityId}`
          : `/communities/create`
      );
    }
  }, [isFan]);

  return (
    <ProtectedRoute>
      <Layout>
        {community.userId == Number(userId) ? (
          <CreatorCommunityPage
            community={community}
            setCommunity={setCommunity}
            linkedCollections={linkedCollections}
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
