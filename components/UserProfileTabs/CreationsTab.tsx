import React from "react";
import { UserWithAllInfo } from "../../pages/api/users/[userId]";
import CollectionGrid from "../CollectionGrid";

type CreationsTabProps = {
  userData: UserWithAllInfo;
};
const CreationsTab = ({ userData }: CreationsTabProps) => {
  return (
    <main>
      {/* @ts-ignore */}
      <CollectionGrid data={userData.createdCollections} />
    </main>
  );
};

export default CreationsTab;
