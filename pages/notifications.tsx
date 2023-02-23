import React from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

const NotificationsPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div>NotificationsPage</div>
      </Layout>
    </ProtectedRoute>
  );
};

export default NotificationsPage;
