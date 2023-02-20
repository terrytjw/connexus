import Layout from "../../../components/Layout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { communities } from "../../../utils/dummyData";
import CreateCommunityPage from "../create";

const EditCommunityPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <CreateCommunityPage community={communities[0]} />
      </Layout>
    </ProtectedRoute>
  );
};

export default EditCommunityPage;
