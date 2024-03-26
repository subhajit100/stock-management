"use client";
import React, { useState } from "react";
import Search from "../components/Search";
import AddProductForm from "../components/AddProductForm";
import ProductTable from "../components/ProductTable";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  timeout: 2000,
  position: positions.TOP_RIGHT,
};

const HomePage = ({ initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);
  return (
    <div className="text-center mx-10">
      <Provider template={AlertTemplate} {...options}>
        <Search products={products} setProducts={setProducts} />
        <AddProductForm products={products} setProducts={setProducts} />
        <ProductTable products={products} setProducts={setProducts} />
      </Provider>
    </div>
  );
};

export default HomePage;
