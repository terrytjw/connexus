import React from "react";
import CollectionGrid from "../../CollectionGrid";
import { CollectionWithMerchAndPremiumChannel } from "../../../lib/api-helpers/collection-api";

type MarketplaceTabProps = {
  collections: CollectionWithMerchAndPremiumChannel[];
};
const MarketplaceTab = ({ collections }: MarketplaceTabProps) => {
  return (
    <div>
      <CollectionGrid data={collections} />
    </div>
  );
};

export default MarketplaceTab;
