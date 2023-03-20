import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
// @ts-ignore
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Sector,
} from "recharts";
import useSWR from "swr";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Loading from "../Loading";
import Modal from "../../components/Modal";
import {
  getCollectionAnalyticsByCollectionAPI,
  getCollectionAnalyticsByCreatorAPI,
  getTopNSellingCollectionsAPI,
} from "../../lib/api-helpers/analytics-api";
import { CollectionWithMerchAndPremiumChannel } from "../../lib/api-helpers/collection-api";
import { lastWeek, todayMinus } from "../../utils/date-util";

type MerchandiseTabProps = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  collections: CollectionWithMerchAndPremiumChannel[];
};

const MerchandiseTab = ({
  isModalOpen,
  setIsModalOpen,
  collections,
}: MerchandiseTabProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const [collectionIdSelected, setCollectionIdSelected] = useState(
    null as unknown as number
  );
  const [dateRange, setDateRange] = useState([
    {
      startDate: lastWeek(),
      endDate: todayMinus(1),
      key: "selection",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {
            collections.find(
              (collection) => collection.collectionId == payload.collectionId
            )?.collectionName
          }
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`Revenue: $${value}`}
        </text>
      </g>
    );
  };

  const {
    data: collectionAnalyticsByCreator,
    isValidating: isByCreatorValidating,
    mutate: mutateCollectionAnalyticsByCreator,
  } = useSWR(
    "getCollectionAnalyticsByCreatorAPI",
    async () =>
      await getCollectionAnalyticsByCreatorAPI(
        userId,
        dateRange[0].startDate,
        dateRange[0].endDate
      )
  );

  const {
    data: collectionAnalyticsByCollection,
    isValidating: isByCollectionValidating,
    mutate: mutateCollectionAnalyticsByCollection,
  } = useSWR(
    collectionIdSelected && !isModalOpen
      ? "getCollectionAnalyticsByCollectionAPI"
      : null,
    async () =>
      await getCollectionAnalyticsByCollectionAPI(
        collectionIdSelected,
        dateRange[0].startDate,
        dateRange[0].endDate
      )
  );

  const {
    data: topSellingCollections,
    isValidating: isTopSellingCollectionsValidating,
  } = useSWR(
    "getTopCollectionsByCreator",
    async () =>
      await getTopNSellingCollectionsAPI(
        dateRange[0].startDate,
        dateRange[0].endDate,
        5,
        userId
      )
  );

  if (
    isByCreatorValidating ||
    isByCollectionValidating ||
    isTopSellingCollectionsValidating
  ) {
    return <Loading />;
  }

  return (
    <>
      {true || collections.length > 0 ? ( // to be updated when user api is updated
        <>
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            className="min-w-fit !max-w-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Filter Merchandise Analytics
              </h3>
              <Button
                variant="outlined"
                size="sm"
                className="border-0 text-red-500"
                onClick={() => {
                  setCollectionIdSelected(null as unknown as number);
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
              COLLECTION
            </h3>
            <div className="mt-2 mb-4 flex flex-wrap gap-4">
              {collections.map(
                (collection: CollectionWithMerchAndPremiumChannel) => {
                  return (
                    <Badge
                      key={collection.collectionId}
                      label={collection.collectionName}
                      size="lg"
                      selected={collection.collectionId == collectionIdSelected}
                      onClick={() => {
                        if (collection.collectionId == collectionIdSelected) {
                          setCollectionIdSelected(null as unknown as number);
                        } else {
                          setCollectionIdSelected(collection.collectionId);
                        }
                      }}
                      className="h-8 min-w-fit rounded-lg"
                    />
                  );
                }
              )}
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
                if (collectionIdSelected) {
                  mutateCollectionAnalyticsByCollection();
                } else {
                  mutateCollectionAnalyticsByCreator();
                }
                setIsModalOpen(false);
              }}
            >
              Submit
            </Button>
          </Modal>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">
                Revenue Per Day
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    collectionIdSelected
                      ? collectionAnalyticsByCollection
                      : collectionAnalyticsByCreator
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
                  <Bar
                    dataKey={`${
                      collectionIdSelected ? "revenue" : "_sum.revenue"
                    }`}
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">
                Tickets Sold Per Day
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={
                    collectionIdSelected
                      ? collectionAnalyticsByCollection
                      : collectionAnalyticsByCreator
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
                    formatter={(value, name, props) => [value, "Tickets Sold"]}
                  />
                  <Legend formatter={(value) => "Tickets Sold"} />

                  <Bar
                    dataKey={`${
                      collectionIdSelected ? "merchSold" : "_sum.merchSold"
                    }`}
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">
                Clicks Per Day
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={
                    collectionIdSelected
                      ? collectionAnalyticsByCollection
                      : collectionAnalyticsByCreator
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
                    formatter={(value, name, props) => [value, "Clicks"]}
                  />
                  <Legend formatter={(value) => "Clicks"} />
                  <Bar
                    dataKey={`${
                      collectionIdSelected ? "clicks" : "_sum.clicks"
                    }`}
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">
                Top 5 Best Selling Collections
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart width={400} height={400}>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={topSellingCollections}
                    dataKey="_sum.revenue"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    fill="#8884d8"
                    onMouseEnter={onPieEnter}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg bg-white px-8 py-16 font-semibold">
          There are no merchandise analytics to show for now, go create a
          collection!
          <Button variant="solid" size="md" href="/merchandise/create">
            Go create a collection
          </Button>
        </div>
      )}
    </>
  );
};

export default MerchandiseTab;
