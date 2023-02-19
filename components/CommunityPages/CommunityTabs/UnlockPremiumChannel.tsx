import CollectionGrid from "../../CollectionGrid";

type UnlockPremiumChannelTabProps = {
  products: any; // TODO: type this
};

const UnlockPremiumChannelTab = ({
  products,
}: UnlockPremiumChannelTabProps) => {
  return (
    <main>
      <CollectionGrid data={products} />
    </main>
  );
};

export default UnlockPremiumChannelTab;
