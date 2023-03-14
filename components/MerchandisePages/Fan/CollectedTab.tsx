import React from "react";
import CollectibleGrid from "../../CollectibleGrid";
import { MerchandiseWithCollectionName } from "../../../utils/types";

type CollectedTabProps = {
  collectedMerchandise: MerchandiseWithCollectionName[];
};
const CollectedTab = ({ collectedMerchandise }: CollectedTabProps) => {
  return (
    <div>
      <CollectibleGrid data={collectedMerchandise} collectedTab={true} />
    </div>
  );
};

export default CollectedTab;
