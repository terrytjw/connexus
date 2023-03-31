import React from "react";
import { UserWithAllInfo } from "../../pages/api/users/[userId]";
import { CommunityWithMemberIds } from "../../utils/types";
import CommunityGrid from "../CommunityPages/CommunityGrid";

type CommunitiesTabProps = {
  userData: UserWithAllInfo;
};

const CommunitiesTab = ({ userData }: CommunitiesTabProps) => {
  return (
    <div>
      <CommunityGrid
        communities={userData.joinedCommunities as CommunityWithMemberIds[]}
        joinedTab={true}
      />
    </div>
  );
};

export default CommunitiesTab;
