import React from "react";
import CollectionGrid from "../../CollectionGrid";

type CollectedTabProps = {
  products: any; // TODO: type this
};
const CollectedTab = ({ products }: CollectedTabProps) => {
  return (
    <div>
      <CollectionGrid data={products} />
    </div>
  );
};

export default CollectedTab;
