import React, { FC } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// to be moved to another file
type ChatRequest = {
  name: string;
  community: string;
  tipAmount: number;
  status: "Accepted" | "Pending" | "Rejected";
};

interface TableProps {
  data: ChatRequest[];
  columns: string[];
}

const Table: FC<TableProps> = ({ data, columns }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="table w-full">
        {/* <!-- head --> */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            {columns.map((headerTitle) => (
              <th>{headerTitle}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* <!-- row 1 --> */}
          {data.map((request) => (
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="/images/bear.jpg"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{request?.name}</div>
                    <div className="text-sm opacity-50">
                      {request?.community}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                {request?.tipAmount}
                <br />
                <span className="badge-ghost badge badge-sm">
                  optional badge
                </span>
              </td>
              <td>
                <span className="badge ">{request?.status}</span>
              </td>
              <th>
                {/* note: these buttons display depending on tab a user is on */}
                <div className="flex flex-col">
                  <button className="btn-ghost btn-xs btn">Accept</button>
                  <button className="btn-ghost btn-xs btn">Reject</button>
                </div>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
