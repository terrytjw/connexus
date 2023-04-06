import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import CreatorCollectionPage from "../../components/MerchandisePages/Creator/[id]";
import FanCollectionPage from "../../components/MerchandisePages/Fan/[id]";
import {
  CollectionWithMerchAndPremiumChannel,
  getCollection,
} from "../../lib/api-helpers/collection-api";
import { getUserInfo } from "../../lib/api-helpers/user-api";
import { UserWithAllInfo } from "../api/users/[userId]";
import { getSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

type CollectionPageProps = {
  userData: UserWithAllInfo;
  collectionData: CollectionWithMerchAndPremiumChannel;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

const CollectionPage = ({ userData, collectionData }: CollectionPageProps) => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="debug-screens">
          <Head>
            <title>Merchandise | Connexus</title>
          </Head>

          {collectionData.creatorId == userData.userId ? (
            <CreatorCollectionPage />
          ) : (
            <FanCollectionPage
              userData={userData}
              collection={collectionData}
            />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CollectionPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.params as Params;

  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = Number(session?.user.userId);

  const userData = await getUserInfo(userId);

  const collectionData = await getCollection(Number(id));
  if (collectionData && Object.keys(collectionData).length === 0) {
    return {
      redirect: {
        destination: "/merchandise",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData,
      collectionData,
    },
  };
};
