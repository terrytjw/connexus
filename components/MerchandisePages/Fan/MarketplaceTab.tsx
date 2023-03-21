import React from "react";
import CollectionGrid from "../../CollectionGrid";
import { CollectionWithMerchAndPremiumChannel } from "../../../lib/api-helpers/collection-api";

type MarketplaceTabProps = {
  collections: CollectionWithMerchAndPremiumChannel[];
  trendingCollections: CollectionWithMerchAndPremiumChannel[];
};
const MarketplaceTab = ({
  collections,
  trendingCollections,
}: MarketplaceTabProps) => {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-slate-600">
        Trending Collections
      </h2>
      <CollectionGrid data={trendingCollections} />
      <h2 className="mt-12 mb-6 text-2xl font-semibold text-slate-600">
        Available Collections
      </h2>
      <CollectionGrid data={collections} />
    </div>
  );
};

export default MarketplaceTab;
