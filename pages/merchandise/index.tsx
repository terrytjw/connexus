import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
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
import { getTopNSellingCollectionsAPI } from "../../lib/api-helpers/analytics-api";

type CollectionsPageProps = {
  trendingCollections: CollectionWithMerchAndPremiumChannel[];
};

const CollectionsPage = ({ trendingCollections }: CollectionsPageProps) => {
  const { isFan } = useContext(UserRoleContext);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="debug-screens">
          <Head>
            <title>Merchandise | Connexus</title>
          </Head>

          {isFan ? (
            <FanCollectionsPage trendingCollections={trendingCollections} />
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
  const collectionsData = await searchAllCollections(0, "");
  const trendingCollectionIds = await getTopNSellingCollectionsAPI();
  const trendingCollections = collectionsData.filter(
    (collection: CollectionWithMerchAndPremiumChannel) => {
      return trendingCollectionIds.some((trendingcollection: any) => {
        return collection.collectionId == trendingcollection.collectionId;
      });
    }
  );

  return {
    props: {
      trendingCollections,
    },
  };
};

export default CollectionsPage;
