import { Event } from "@prisma/client";
import { useRouter } from "next/router";
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
  AnalyticsEntity,
  exportAnalyticsToCSV,
  exportAnalyticsToPDF,
  getEventAnalyticsByCreatorAPI,
  getEventAnalyticsByEventAPI,
} from "../../lib/api-helpers/analytics-api";
import { lastWeek, todayMinus } from "../../utils/date-util";
import { SelectOption } from "../../pages/analytics";

type EventTabProps = {
  options: SelectOption[];
  optionSelected: SelectOption;
  setOptionSelected: Dispatch<SetStateAction<SelectOption>>;
  events: Event[];
};

const EventTab = ({
  options,
  optionSelected,
  setOptionSelected,
  events,
}: EventTabProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
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
      {events.length > 0 ? (
        <>
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            className="!max-w-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Filter Event Analytics
              </h3>
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
              {events.map((event: Event) => {
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

          <div className="mt-8 flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Select
                data={options}
                selected={optionSelected}
                setSelected={setOptionSelected}
                className="w-40 flex-grow-0 sm:w-64"
              />
              <div className="tooltip tooltip-primary" data-tip={optionSelected.tooltip}>
                <Button
                  variant="solid"
                  size="sm"
                  className="!bg-blue-100 !text-blue-600"
                >
                  i
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="dropdown-end dropdown">
                <label tabIndex={0}>
                  <Button variant="solid" size="md" className="shadow-sm">
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
                        const url = exportAnalyticsToPDF(
                          userId,
                          AnalyticsEntity.EVENT,
                          dateRange[0].startDate,
                          dateRange[0].endDate
                        );

                        router.push(url);
                        setTimeout(() => router.reload(), 3000);
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
                        const url = exportAnalyticsToCSV(
                          userId,
                          AnalyticsEntity.EVENT,
                          dateRange[0].startDate,
                          dateRange[0].endDate
                        );

                        router.push(url);
                        setTimeout(() => router.reload(), 3000);
                      }}
                    >
                      Export and download as CSV
                    </Button>
                  </li>
                </ul>
              </div>
              <Button
                variant="solid"
                size="md"
                className="hidden max-w-sm !bg-white !text-gray-700 shadow-sm sm:flex"
                onClick={() => setIsModalOpen(true)}
              >
                Filter
                <BiFilter className="text-gray-500 h-6 w-6" />
              </Button>
              <BiFilter
                className="text-gray-500 h-12 w-10 sm:hidden"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>

          <div className="mt-8 grid w-full gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold text-gray-900">
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
                    fill="#1A54C2"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold text-gray-900">
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
                    fill="#1A54C2"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold text-gray-900">
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
                    fill="#1A54C2"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-white py-8 pl-4 pr-8">
              <h3 className="mb-8 ml-4 text-xl font-semibold text-gray-900">
                Likes
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
                    formatter={(value, name, props) => [value, "Likes"]}
                  />
                  <Legend formatter={(value) => "Likes"} />
                  <Bar
                    dataKey={`${eventIdSelected ? "likes" : "_sum.likes"}`}
                    fill="#1A54C2"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="my-8 flex w-full items-center justify-between">
            <Select
              data={options}
              selected={optionSelected}
              setSelected={setOptionSelected}
              className="w-40 flex-grow-0 sm:w-64"
            />
          </div>
          <div className="flex flex-col items-center text-center justify-center gap-8 rounded-lg bg-white px-8 py-16 font-semibold text-gray-900">
            There are no event analytics to show for now, go create an event!
            <Button variant="solid" size="md" href="/events/create">
              Go create an event
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default EventTab;
