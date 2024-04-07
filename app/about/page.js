import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute>
      <div>About</div>
    </ProtectedRoute>
  );
};

export default Page;
