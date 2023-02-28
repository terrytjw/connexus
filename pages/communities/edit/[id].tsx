import { useRouter } from "next/router";
import CreateCommunityPage from "../create";
import Loading from "../../../components/Loading";
import useSWR from "swr";
import { swrFetcher } from "../../../lib/swrFetcher";

const EditCommunityPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: community,
    error,
    isLoading,
  } = useSWR(`http://localhost:3000/api/community/${id}`, swrFetcher);

  if (isLoading) return <Loading />;

  return <CreateCommunityPage community={community} />;
};

export default EditCommunityPage;
