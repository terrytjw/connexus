import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useContext } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import CreatorCollectionsPage from "../../components/MerchandisePages/Creator";
import FanCollectionsPage from "../../components/MerchandisePages/Fan";
import { UserRoleContext } from "../../contexts/UserRoleProvider";
import { Toaster } from "react-hot-toast";
import {
  CollectionWithMerchAndPremiumChannel,
  searchAllCollections,
} from "../../lib/api-helpers/collection-api";
import { searchCollectedMerchandise } from "../../lib/api-helpers/merchandise-api";
import { MerchandiseWithCollectionName } from "../../utils/types";

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
      <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#34383F",
              textAlign: "center",
            },
          }}
        />
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
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
