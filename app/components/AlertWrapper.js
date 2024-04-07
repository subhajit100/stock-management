"use client";
import React from "react";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  timeout: 2000,
  position: positions.TOP_RIGHT,
};

const AlertWrapper = ({ children }) => {
  return (
    <Provider template={AlertTemplate} {...options}>
      {children}
    </Provider>
  );
};

export default AlertWrapper;
