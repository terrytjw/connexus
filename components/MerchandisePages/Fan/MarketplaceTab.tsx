import React from "react";
import Button from "../../Button";
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
      <div className="flex gap-4">
        <h2 className="mb-6 text-2xl font-semibold tracking-wide text-slate-600">
          Trending Collections
        </h2>
        <div className="tooltip" data-tip="Top Selling Collections">
          <Button
            variant="solid"
            size="sm"
            className="!bg-blue-100 !text-blue-600"
          >
            i
          </Button>
        </div>
      </div>
      <CollectionGrid data={trendingCollections} />
      <h2 className="mt-12 mb-6 text-2xl font-semibold text-slate-600">
        Available Collections
      </h2>
      <CollectionGrid data={collections} />
    </div>
  );
};

export default MarketplaceTab;
