import { useState } from "react";
import Toggle from "../../components/Toggle";
import CreatorCommunityPage from "../../components/CommunityPages/Creator/CreatorCommunityPage";
import FanCommunityPage from "../../components/CommunityPages/Fan/FanCommunityPage";

const CommunityPage = () => {
  const [isCreator, setIsCreator] = useState(true);

  return (
    <div>
      {/* to be removed after pr approved */}
      <div className="mt-4 flex gap-2">
        Toggle creator / fan view
        <Toggle isChecked={isCreator} setIsChecked={setIsCreator} />
      </div>
      {isCreator ? <CreatorCommunityPage /> : <FanCommunityPage />}
    </div>
  );
};

export default CommunityPage;
