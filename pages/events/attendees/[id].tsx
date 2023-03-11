import React, { useState } from "react";

import { FaChevronLeft } from "react-icons/fa";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Layout from "../../../components/Layout";
import { GetServerSideProps } from "next";
import axios from "axios";
import Button from "../../../components/Button";
import AttendeesTable from "../../../components/EventPages/AttendeesTable";
import { User } from "@prisma/client";
import Modal from "../../../components/Modal";
// import { Html5QrcodeScanner } from "html5-qrcode";
import { QrReader } from "react-qr-reader";
import {
  viewAttendeeList,
  exportCSV,
  exportPDF,
} from "../../../lib/api-helpers/event-api";

type AttendeesPageProps = {
  users: User[];
};

const AttendeesPage = ({ users }: AttendeesPageProps) => {
  const [isQrModalOpenOpen, setIsQrModalOpen] = useState(false);
  const [data, setData] = useState("No result");

  // event id, user id, ticket id
  console.log("users", users);

  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
          {/* QR Modal */}
          <Modal
            isOpen={isQrModalOpenOpen}
            setIsOpen={setIsQrModalOpen}
            className="min-w-fit"
          >
            <h1>Scan a QR code</h1>
            <QrReader
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.text);
                }

                if (!!error) {
                  console.info(error);
                }
              }}
              //this is facing mode : "environment " it will open backcamera of the smartphone and if not found will
              // open the front camera
              constraints={{ facingMode: "environment" }}
            />
            <p>Result: {data}</p>
          </Modal>

          {/* Header */}
          <div className="mb-8 flex justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                className="border-0"
                variant="outlined"
                size="md"
                onClick={() => history.back()}
              >
                <FaChevronLeft />
              </Button>
              <h1 className="text-3xl font-bold">Attendees</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* TODO: refactor buttons into dropdown  */}
              <Button
                href={exportPDF(1)} // redirect users to the url
                variant="solid"
                size="md"
                className="max-w-xs "
              >
                Export PDF
              </Button>
              <Button
                href={exportCSV(1)} // redirect users to the url
                variant="solid"
                size="md"
                className="max-w-xs "
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                size="md"
                className="max-w-xs"
                onClick={() => setIsQrModalOpen(true)}
              >
                Scan QR Code
              </Button>
            </div>
          </div>

          <section>
            <div className="pt-6">
              <AttendeesTable
                data={users}
                columns={["Name", "Email Address", "Check-in Status"]}
              />
            </div>
          </section>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default AttendeesPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await viewAttendeeList(1);

  return {
    props: {
      users,
    },
  };
};
