import { useRouter } from "next/router";
import CreateCommunityPage from "../create";
import Loading from "../../../components/Loading";
import useSWR from "swr";
import { getCommunityAPI } from "../../../lib/api-helpers/community-api";

const EditCommunityPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: community,
    error,
    isLoading,
  } = useSWR(id, getCommunityAPI);

  if (isLoading) return <Loading />;

  return <CreateCommunityPage community={community} />;
};

export default EditCommunityPage;
