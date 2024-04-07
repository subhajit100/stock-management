"use client";
// this component is created as we are getting error when we do 'use client' inside layout component due to presence of metadata in it.
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const MainLayoutWrapper = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  return (
    <>
      {isLoggedIn && <Navbar />}
      {children}
    </>
  );
};

export default MainLayoutWrapper;
