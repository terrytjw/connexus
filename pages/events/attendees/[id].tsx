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

type AttendeesPageProps = {
  users: User[];
};

const AttendeesPage = ({ users }: AttendeesPageProps) => {
  const [isQrModalOpenOpen, setIsQrModalOpen] = useState(false);
  const [data, setData] = useState("No result");

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
              <Button
                href="/events/create"
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
                columns={[
                  "ID",
                  "Name",
                  "Email Address",
                  "Check-in Status",
                  "Digital Badge Status",
                ]}
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
  //  TODO: replace this data with users associated with this event
  const { data: users } = await axios.get(`http://localhost:3000/api/users`);

  return {
    props: {
      users,
    },
  };
};
