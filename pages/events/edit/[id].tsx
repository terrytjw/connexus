import React from "react";
import Layout from "../../../components/Layout";
import ProtectedRoute from "../../../components/ProtectedRoute";

const EditEventPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div>Edit EventPage</div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditEventPage;
