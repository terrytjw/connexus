import { communities } from "../../../utils/dummyData";
import CreateCommunityPage from "../create";

const EditCommunityPage = () => {
  return <CreateCommunityPage community={communities[0]} />;
};

export default EditCommunityPage;
