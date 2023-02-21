import React from "react";
import CollectibleGrid from "../../CollectibleGrid";

type CollectedTabProps = {
  products: any; // TODO: type this
};
const CollectedTab = ({ products }: CollectedTabProps) => {
  return (
    <div>
      <CollectibleGrid data={products} collectedTab={true} />
    </div>
  );
};

export default CollectedTab;
