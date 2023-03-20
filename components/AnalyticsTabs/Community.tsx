import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
// @ts-ignore
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";
import Button from "../../components/Button";
import Loading from "../Loading";
import Modal from "../../components/Modal";
import { getCommunityAnalyticsByCreatorAPI } from "../../lib/api-helpers/analytics-api";
import { lastWeek, todayMinus } from "../../utils/date-util";
import { CommunityWithCreatorAndChannelsAndMembers } from "../../utils/types";

type CommunityTabProps = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  community: CommunityWithCreatorAndChannelsAndMembers | null;
};

const CommunityTab = ({
  isModalOpen,
  setIsModalOpen,
  community,
}: CommunityTabProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const [dateRange, setDateRange] = useState([
    {
      startDate: lastWeek(),
      endDate: todayMinus(1),
      key: "selection",
    },
  ]);

  const {
    data: communityAnalyticsByCreator,
    isValidating: isByCreatorValidating,
    mutate: mutateCommunityAnalyticsByCreator,
  } = useSWR(
    "getCommunityAnalyticsByCreatorAPI",
    async () =>
      await getCommunityAnalyticsByCreatorAPI(
        userId,
        dateRange[0].startDate,
        dateRange[0].endDate
      )
  );

  if (isByCreatorValidating) {
    return <Loading />;
  }

  return (
    <>
      {true || community ? ( // to be updated when user api is updated
        <>
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            className="min-w-fit !max-w-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Filter Community Analytics
              </h3>
              <Button
                variant="outlined"
                size="sm"
                className="border-0 text-red-500"
                onClick={() => {
                  setDateRange([
                    {
                      startDate: lastWeek(),
                      endDate: todayMinus(1),
                      key: "selection",
                    },
                  ]);
                }}
              >
                Clear
              </Button>
            </div>

            <h3 className="mt-8 text-sm font-medium text-gray-500">
              DATE RANGE
            </h3>
            <DateRange
              showSelectionPreview={false}
              showDateDisplay={false}
              onChange={(item: any) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              maxDate={todayMinus(1)}
              className="w-full min-w-fit [&_div]:w-full"
            />
            <Button
              variant="solid"
              size="md"
              className="mt-8"
              onClick={() => {
                mutateCommunityAnalyticsByCreator();
                setIsModalOpen(false);
              }}
            >
              Submit
            </Button>
          </Modal>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">
                Clicks Per Day
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={communityAnalyticsByCreator}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      return new Date(value).toLocaleString("en-gb", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      });
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => {
                      return new Date(label).toLocaleString("en-gb", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    formatter={(value, name, props) => [value, "Clicks"]}
                  />
                  <Legend formatter={(value) => "Clicks"} />
                  <Bar dataKey="_sum.clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">
                Community Growth
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={communityAnalyticsByCreator}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      return new Date(value).toLocaleString("en-gb", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      });
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => {
                      return new Date(label).toLocaleString("en-gb", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    formatter={(value, name, props) => [value, "Members"]}
                  />
                  <Legend formatter={(value) => "Members"} />
                  <Bar dataKey="_sum.members" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">
                Premium Members Growth
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={communityAnalyticsByCreator}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      return new Date(value).toLocaleString("en-gb", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      });
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => {
                      return new Date(label).toLocaleString("en-gb", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    formatter={(value, name, props) => [
                      value,
                      "Premium Members",
                    ]}
                  />
                  <Legend formatter={(value) => "Premium Members"} />
                  <Bar dataKey="_sum.premiumMembers" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg bg-white px-8 py-16 font-semibold">
          There are no community analytics to show for now, go create a
          community to interact with your fans!
          <Button variant="solid" size="md" href="/communities/create">
            Go create a community
          </Button>
        </div>
      )}
    </>
  );
};

export default CommunityTab;
