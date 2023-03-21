import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import Button from "../Button";
import Select from "../Select";
import { SelectOption } from "../../pages/analytics";
import {
  AnalyticsEntity,
  exportAnalyticsToCSV,
  exportAnalyticsToPDF,
} from "../../lib/api-helpers/analytics-api";

type AnalyticsPageProps = {
  channelAnalyticsData: any[];
  communityAnalyticsData: any[];
  collectionAnalyticsData: any[];
  eventAnalyticsData: any[];
  options: SelectOption[];
  optionSelected: SelectOption;
  setOptionSelected: Dispatch<SetStateAction<SelectOption>>;
};

const OverviewTab = ({
  channelAnalyticsData,
  communityAnalyticsData,
  collectionAnalyticsData,
  eventAnalyticsData,
  options,
  optionSelected,
  setOptionSelected,
}: AnalyticsPageProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  return (
    <>
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
                  onClick={() => {
                    if (
                      channelAnalyticsData.length > 0 ||
                      communityAnalyticsData.length > 0 ||
                      collectionAnalyticsData.length > 0 ||
                      eventAnalyticsData.length > 0
                    ) {
                      const url = exportAnalyticsToPDF(
                        userId,
                        AnalyticsEntity.OVERVIEW
                      );

                      router.push(url);
                      setTimeout(() => router.reload(), 3000);
                    }
                  }}
                >
                  Export and download as PDF
                </Button>
              </li>
              <li>
                <Button
                  size="md"
                  variant="solid"
                  className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                  onClick={() => {
                    if (
                      channelAnalyticsData.length > 0 ||
                      communityAnalyticsData.length > 0 ||
                      collectionAnalyticsData.length > 0 ||
                      eventAnalyticsData.length > 0
                    ) {
                      const url = exportAnalyticsToCSV(
                        userId,
                        AnalyticsEntity.OVERVIEW
                      );

                      router.push(url);
                      setTimeout(() => router.reload(), 3000);
                    }
                  }}
                >
                  Export and download as CSV
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-8 grid w-full gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white py-8 pl-4 pr-8">
          <h3 className="mb-8 ml-4 text-xl font-semibold">
            Merchandise Revenue Per Day
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={collectionAnalyticsData}>
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
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip
                labelFormatter={(label) => {
                  return new Date(label).toLocaleString("en-gb", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                }}
                formatter={(value, name, props) => [`$${value}`, "Revenue"]}
              />
              <Legend formatter={(value) => "Revenue"} />
              <Bar dataKey="_sum.revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white py-8 pl-4 pr-8">
          <h3 className="mb-8 ml-4 text-xl font-semibold">
            Event Revenue Per Day
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventAnalyticsData}>
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
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip
                labelFormatter={(label) => {
                  return new Date(label).toLocaleString("en-gb", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                }}
                formatter={(value, name, props) => [`$${value}`, "Revenue"]}
              />
              <Legend formatter={(value) => "Revenue"} />
              <Bar dataKey="_sum.revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white py-8 pl-4 pr-8">
          <h3 className="mb-8 ml-4 text-xl font-semibold">Community Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart width={500} height={300} data={communityAnalyticsData}>
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
                  name.toString().includes("premium")
                    ? "Premium Members"
                    : "Non Premium Members",
                ]}
              />
              <Legend
                formatter={(value) => [
                  value.includes("premium")
                    ? "Premium Members"
                    : "Non Premium Members",
                ]}
              />
              <Bar
                dataKey="_sum.nonPremiumMembers"
                stackId="a"
                fill="#8884d8"
              />
              <Bar dataKey="_sum.premiumMembers" stackId="a" fill="#82ca9d">
                <LabelList
                  position="top"
                  valueAccessor={(entry: any) => {
                    return entry
                      ? entry._sum.nonPremiumMembers + entry._sum.premiumMembers
                      : 0;
                  }}
                />
              </Bar>
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
            <BarChart width={500} height={300} data={channelAnalyticsData}>
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
              <Bar dataKey="_avg.engagement" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
