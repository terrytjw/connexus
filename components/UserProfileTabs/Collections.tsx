import React, { useState } from "react";
import CollectionGrid from "../CollectionGrid";
import WordToggle from "../Toggle/WordToggle";

type UserProfileCollectionsProps = {
  products: any; // TODO: type this
};
const UserProfileCollections = ({ products }: UserProfileCollectionsProps) => {
  const [isPaid, setIsPaid] = useState(false);

  return (
    <main>
      <div className="mb-7 flex justify-center px-2 sm:justify-start">
        <WordToggle
          leftWord="Free"
          rightWord="Paid"
          isChecked={isPaid}
          setIsChecked={setIsPaid}
        />
      </div>
      <CollectionGrid data={products} />
    </main>
  );
};

export default UserProfileCollections;
