import CollectionGrid from "../../CollectionGrid";
import { CollectionWithMerchAndPremiumChannel } from "../../../lib/api-helpers/collection-api";

type UnlockPremiumChannelTabProps = {
  linkedCollections: CollectionWithMerchAndPremiumChannel[];
};

const UnlockPremiumChannelTab = ({
  linkedCollections,
}: UnlockPremiumChannelTabProps) => {
  return (
    <main>
      <CollectionGrid data={linkedCollections} />
    </main>
  );
};

export default UnlockPremiumChannelTab;
