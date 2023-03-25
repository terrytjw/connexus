import { GetServerSideProps } from "next";
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
import { getSession, useSession } from "next-auth/react";

type CollectionPageProps = {
  userData: UserWithAllInfo;
  collectionData: CollectionWithMerchAndPremiumChannel;
};

const CollectionPage = ({ userData, collectionData }: CollectionPageProps) => {
  // const { data: session } = useSession();
  // const userId = Number(session?.user.userId);

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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { id } = context.params;

  const session = await getSession(context);
  const userId = Number(session?.user.userId);

  const userData = await getUserInfo(userId);

  const collectionData = await getCollection(id);
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
