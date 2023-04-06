import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useContext } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import CreatorCollectionsPage from "../../components/MerchandisePages/Creator";
import FanCollectionsPage from "../../components/MerchandisePages/Fan";
import { UserRoleContext } from "../../contexts/UserRoleProvider";
import {
  CollectionWithMerchAndPremiumChannel,
  searchAllCollections,
} from "../../lib/api-helpers/collection-api";
import { searchCollectedMerchandise } from "../../lib/api-helpers/merchandise-api";
import { MerchandiseWithCollectionName } from "../../utils/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

type CollectionsPageProps = {
  merchandiseData: MerchandiseWithCollectionName[];
  collectionsData: CollectionWithMerchAndPremiumChannel[];
};

const CollectionsPage = ({
  merchandiseData,
  collectionsData,
}: CollectionsPageProps) => {
  const { isFan } = useContext(UserRoleContext);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="debug-screens">
          <Head>
            <title>Merchandise | Connexus</title>
          </Head>

          {isFan ? (
            <FanCollectionsPage
              merchandiseData={merchandiseData}
              collectionsData={collectionsData}
            />
          ) : (
            <CreatorCollectionsPage />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = session?.user.userId;

  const collectionsData = await searchAllCollections(0, "");
  const merchandiseData = await searchCollectedMerchandise(
    parseInt(userId as string),
    "",
    0
  );

  return {
    props: {
      merchandiseData,
      collectionsData,
    },
  };
};

export default CollectionsPage;
