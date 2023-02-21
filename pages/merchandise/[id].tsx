import Head from "next/head";
import React, { useState } from "react";
import CreatorCollectionPage from "../../components/MerchandisePages/Creator/[id]";
import FanCollectionPage from "../../components/MerchandisePages/Fan/[id]";
import WordToggle from "../../components/Toggle/WordToggle";

const CollectionPage = () => {
  const [isCreator, setIsCreator] = useState(false);

  return (
    <div className="debug-screens">
      <Head>
        <title>Merchandise | Connexus</title>
      </Head>

      <WordToggle
        leftWord="Fan"
        rightWord="Creator"
        isChecked={isCreator}
        setIsChecked={setIsCreator}
      />

      {isCreator ? <CreatorCollectionPage /> : <FanCollectionPage />}
    </div>
  );
};

export default CollectionPage;
