import React, { useState } from "react";
import Head from "next/head";
import WordToggle from "../../components/Toggle/WordToggle";
import CreatorCollectionsPage from "../../components/MerchandisePages/Creator";
import FanCollectionsPage from "../../components/MerchandisePages/Fan";

const CollectionsPage = () => {
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

      {isCreator ? <CreatorCollectionsPage /> : <FanCollectionsPage />}
    </div>
  );
};

export default CollectionsPage;
