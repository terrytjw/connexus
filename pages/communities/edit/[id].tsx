import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import CreateCommunityPage from "../create";
import { getCommunityAPI } from "../../../lib/api-helpers/community-api";
import { CommunityWithCreatorAndChannelsAndMembers } from "../../../utils/types";

import { ParsedUrlQuery } from "querystring";

import { authOptions } from "../../api/auth/[...nextauth]";

type EditCommunityPageProps = {
  community: CommunityWithCreatorAndChannelsAndMembers;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

const EditCommunityPage = ({ community }: EditCommunityPageProps) => {
  return <CreateCommunityPage community={community} />;
};

export default EditCommunityPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.params as Params;

  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = Number(session?.user.userId);

  const community = await getCommunityAPI(Number(id));

  if (community.creator.userId !== userId) {
    return {
      redirect: {
        destination: "/communities",
        permanent: false,
      },
    };
  }

  return {
    props: {
      community,
    },
  };
};
