import React from "react";
import CollectionGrid from "../../CollectionGrid";

type MarketplaceTabProps = {
  products: any; // TODO: type this
};
const MarketplaceTab = ({ products }: MarketplaceTabProps) => {
  return (
    <div>
      <CollectionGrid data={products} />
    </div>
  );
};

export default MarketplaceTab;
