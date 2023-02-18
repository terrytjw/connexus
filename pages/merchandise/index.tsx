import React, { useState } from "react";
import Head from "next/head";
import WordToggle from "../../components/Toggle/WordToggle";
import CreatorMerchandisePage from "../../components/MerchandisePages/Creator";
import FanMerchandisePage from "../../components/MerchandisePages/Fan";

const MerchandisePage = () => {
  const [isCreator, setIsCreator] = useState(false);

  return (
    <div className="debug-screens">
      <Head>
        <title>Merchandise | Connexus</title>
      </Head>

      <main className="p-10">
        <h1 className="text-3xl font-bold">Digital Merchandise</h1>
        <h2 className="py-6 text-gray-700">View your digital merchandise</h2>

        <WordToggle
          leftWord="Fan"
          rightWord="Creator"
          isChecked={isCreator}
          setIsChecked={setIsCreator}
        />

        {isCreator ? <CreatorMerchandisePage /> : <FanMerchandisePage />}
      </main>
    </div>
  );
};

export default MerchandisePage;
