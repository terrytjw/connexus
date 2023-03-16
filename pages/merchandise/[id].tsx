import { GetServerSideProps } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import CreatorCollectionPage from "../../components/MerchandisePages/Creator/[id]";
import FanCollectionPage from "../../components/MerchandisePages/Fan/[id]";
import {
  CollectionWithMerchAndPremiumChannel,
  getCollection,
} from "../../lib/api-helpers/collection-api";

type CollectionPageProps = {
  collectionData: CollectionWithMerchAndPremiumChannel;
};

const CollectionPage = ({ collectionData }: CollectionPageProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="debug-screens">
          <Head>
            <title>Merchandise | Connexus</title>
          </Head>

          {collectionData.creatorId == userId ? (
            <CreatorCollectionPage />
          ) : (
            <FanCollectionPage collection={collectionData} />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CollectionPage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { id } = context.params;

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
      collectionData,
    },
  };
};
