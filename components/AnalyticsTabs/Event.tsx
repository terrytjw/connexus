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
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Loading from "../Loading";
import Modal from "../../components/Modal";
import {
  getEventAnalyticsByCreatorAPI,
  getEventAnalyticsByEventAPI,
} from "../../lib/api-helpers/analytics-api";
import { lastWeek, todayMinus } from "../../utils/date-util";
import { EventWithAllDetails } from "../../utils/types";

type EventTabProps = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  events: EventWithAllDetails[];
};

const EventTab = ({ isModalOpen, setIsModalOpen, events }: EventTabProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const [eventIdSelected, setEventIdSelected] = useState(
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
    data: eventAnalyticsByCreator,
    isValidating: isByCreatorValidating,
    mutate: mutateEventAnalyticsByCreator,
  } = useSWR(
    "getEventAnalyticsByCreatorAPI",
    async () =>
      await getEventAnalyticsByCreatorAPI(
        userId,
        dateRange[0].startDate,
        dateRange[0].endDate
      )
  );

  const {
    data: eventAnalyticsByEvent,
    isValidating: isByEventValidating,
    mutate: mutateEventAnalyticsByEvent,
  } = useSWR(
    eventIdSelected && !isModalOpen ? "getEventAnalyticsByEventAPI" : null,
    async () =>
      await getEventAnalyticsByEventAPI(
        eventIdSelected,
        dateRange[0].startDate,
        dateRange[0].endDate
      )
  );

  if (isByCreatorValidating || isByEventValidating) {
    return <Loading />;
  }

  return (
    <>
      {true || events.length > 0 ? ( // to be updated when user api is updated
        <>
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            className="min-w-fit !max-w-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Filter Event Analytics</h3>
              <Button
                variant="outlined"
                size="sm"
                className="border-0 text-red-500"
                onClick={() => {
                  setEventIdSelected(null as unknown as number);
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

            <h3 className="mt-8 text-sm font-medium text-gray-500">EVENT</h3>
            <div className="mt-2 mb-4 flex flex-wrap gap-4">
              {events.map((event: EventWithAllDetails) => {
                return (
                  <Badge
                    key={event.eventId}
                    label={event.eventName}
                    size="lg"
                    selected={event.eventId == eventIdSelected}
                    onClick={() => {
                      if (event.eventId == eventIdSelected) {
                        setEventIdSelected(null as unknown as number);
                      } else {
                        setEventIdSelected(event.eventId);
                      }
                    }}
                    className="min-h-8 h-fit min-w-fit rounded-lg"
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
                if (eventIdSelected) {
                  mutateEventAnalyticsByEvent();
                } else {
                  mutateEventAnalyticsByCreator();
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
                    eventIdSelected
                      ? eventAnalyticsByEvent
                      : eventAnalyticsByCreator
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
                    dataKey={`${eventIdSelected ? "revenue" : "_sum.revenue"}`}
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
                    eventIdSelected
                      ? eventAnalyticsByEvent
                      : eventAnalyticsByCreator
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
                      eventIdSelected ? "ticketsSold" : "_sum.ticketsSold"
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
                    eventIdSelected
                      ? eventAnalyticsByEvent
                      : eventAnalyticsByCreator
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
                    dataKey={`${eventIdSelected ? "clicks" : "_sum.clicks"}`}
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold">Likes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={
                    eventIdSelected
                      ? eventAnalyticsByEvent
                      : eventAnalyticsByCreator
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
                    dataKey={`${eventIdSelected ? "likes" : "_sum.likes"}`}
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg bg-white px-8 py-16 font-semibold">
          There are no event analytics to show for now, go create an event!
          <Button variant="solid" size="md" href="/events/create">
            Go create an event
          </Button>
        </div>
      )}
    </>
  );
};

export default EventTab;
