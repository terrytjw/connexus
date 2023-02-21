import React from "react";
import Layout from "../../../components/Layout";
import ProtectedRoute from "../../../components/ProtectedRoute";

const RegisterEventPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div>Register EventPage</div>
      </Layout>
    </ProtectedRoute>
  );
};

export default RegisterEventPage;
