import { Channel } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
// @ts-ignore
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { BiFilter } from "react-icons/bi";
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
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Loading from "../Loading";
import Modal from "../../components/Modal";
import Select from "../Select";
import {
  getChannelAnalyticsByChannelAPI,
  getChannelAnalyticsByCreatorAPI,
} from "../../lib/api-helpers/analytics-api";
import { SelectOption } from "../../pages/analytics";
import { lastWeek, todayMinus } from "../../utils/date-util";

type ChannelTabProps = {
  options: SelectOption[];
  optionSelected: SelectOption;
  setOptionSelected: Dispatch<SetStateAction<SelectOption>>;
  channels: Channel[];
};

const ChannelTab = ({
  options,
  optionSelected,
  setOptionSelected,
  channels,
}: ChannelTabProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channelIdSelected, setChannelIdSelected] = useState(
    null as unknown as number
  );
  const [dateRange, setDateRange] = useState([
    {
      startDate: lastWeek(),
      endDate: todayMinus(1),
      key: "selection",
    },
  ]);

  const {
    data: channelAnalyticsByCreator,
    isValidating: isByCreatorValidating,
    mutate: mutateChannelAnalyticsByCreator,
  } = useSWR(
    "getChannelAnalyticsByCreatorAPI",
    async () =>
      await getChannelAnalyticsByCreatorAPI(
        userId,
        dateRange[0].startDate,
        dateRange[0].endDate
      )
  );

  const {
    data: channelAnalyticsByChannel,
    isValidating: isByChannelValidating,
    mutate: mutateChannelAnalyticsByChannel,
  } = useSWR(
    channelIdSelected && !isModalOpen
      ? "getChannelAnalyticsByChannelAPI"
      : null,
    async () =>
      await getChannelAnalyticsByChannelAPI(
        channelIdSelected,
        dateRange[0].startDate,
        dateRange[0].endDate
      )
  );

  if (isByCreatorValidating || isByChannelValidating) {
    return <Loading />;
  }

  return (
    <>
      {true || channels.length > 0 ? ( // to be updated when user api is updated
        <>
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            className="min-w-fit !max-w-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Filter Channel Analytics
              </h3>
              <Button
                variant="outlined"
                size="sm"
                className="border-0 text-red-500"
                onClick={() => {
                  setChannelIdSelected(null as unknown as number);
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

            <h3 className="mt-8 text-sm font-medium text-gray-500">CHANNEL</h3>
            <div className="mt-2 mb-4 flex flex-wrap gap-4">
              {channels.map((channel: Channel) => {
                return (
                  <Badge
                    key={channel.channelId}
                    label={channel.name}
                    size="lg"
                    selected={channel.channelId == channelIdSelected}
                    onClick={() => {
                      if (channel.channelId == channelIdSelected) {
                        setChannelIdSelected(null as unknown as number);
                      } else {
                        setChannelIdSelected(channel.channelId);
                      }
                    }}
                    className="h-8 min-w-fit rounded-lg"
                  />
                );
              })}
            </div>
            <div className="divider"></div>
            <h3 className="text-sm font-medium text-gray-500">DATE RANGE</h3>
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
                if (channelIdSelected) {
                  mutateChannelAnalyticsByChannel();
                } else {
                  mutateChannelAnalyticsByCreator();
                }
                setIsModalOpen(false);
              }}
            >
              Submit
            </Button>
          </Modal>

          <div className="mt-8 flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Select
                data={options}
                selected={optionSelected}
                setSelected={setOptionSelected}
                className="w-40 flex-grow-0 sm:w-64"
              />
              <div className="tooltip" data-tip={optionSelected.tooltip}>
                <Button
                  variant="solid"
                  size="sm"
                  className="!bg-blue-100 !text-blue-500"
                >
                  i
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="dropdown-end dropdown">
                <label tabIndex={0}>
                  <Button variant="solid" size="md">
                    Export <span className="hidden sm:contents">Data</span>
                  </Button>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-64 bg-base-100 p-2 shadow"
                >
                  <li>
                    <Button
                      size="md"
                      variant="solid"
                      className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                    >
                      Export and download as PDF
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="md"
                      variant="solid"
                      className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                    >
                      Export and download as CSV
                    </Button>
                  </li>
                </ul>
              </div>
              <Button
                variant="solid"
                size="md"
                className="hidden max-w-sm !bg-white !text-gray-700 sm:flex"
                onClick={() => setIsModalOpen(true)}
              >
                Filter
                <BiFilter className="h-8 w-8" />
              </Button>
              <BiFilter
                className="h-12 w-10 sm:hidden"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>

          <div className="mt-8 grid w-full gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">Likes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={
                    channelIdSelected
                      ? channelAnalyticsByChannel
                      : channelAnalyticsByCreator
                  }
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
                    formatter={(value, name, props) => [value, "Likes"]}
                  />
                  <Legend formatter={(value) => "Likes"} />
                  <Bar
                    dataKey={`${channelIdSelected ? "likes" : "_sum.likes"}`}
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">Comments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={
                    channelIdSelected
                      ? channelAnalyticsByChannel
                      : channelAnalyticsByCreator
                  }
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
                    formatter={(value, name, props) => [value, "Comments"]}
                  />
                  <Legend formatter={(value) => "Comments"} />
                  <Bar
                    dataKey={`${
                      channelIdSelected ? "comments" : "_sum.comments"
                    }`}
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <div className="mb-8 ml-4 flex items-center gap-4">
                <h3 className="text-xl font-semibold">Post Engagement</h3>
                <div
                  className="tooltip"
                  data-tip="Ratio of interactions with a post (likes and comments) to total number of members in your community"
                >
                  <Button
                    variant="solid"
                    size="sm"
                    className="!bg-blue-100 !text-blue-500"
                  >
                    i
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={
                    channelIdSelected
                      ? channelAnalyticsByChannel
                      : channelAnalyticsByCreator
                  }
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
                  <YAxis
                    tickFormatter={(value) =>
                      `${((value as number) * 100).toFixed(0)}%`
                    }
                  />
                  <Tooltip
                    labelFormatter={(label) => {
                      return new Date(label).toLocaleString("en-gb", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    formatter={(value, name, props) => [
                      `${((value as number) * 100).toFixed(2)}%`,
                      "Post Engagement",
                    ]}
                  />
                  <Legend formatter={(value) => "Post Engagement"} />
                  <Bar
                    dataKey={`${
                      channelIdSelected ? "engagement" : "_avg.engagement"
                    }`}
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg bg-white px-8 py-16 font-semibold">
          There are no channel analytics to show for now, go create a community
          to interact with your fans!
          <Button variant="solid" size="md" href="/communities/create">
            Go create a community
          </Button>
        </div>
      )}
    </>
  );
};

export default ChannelTab;
