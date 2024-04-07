import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute>
      <div>Careers</div>
    </ProtectedRoute>
  );
};

export default Page;
