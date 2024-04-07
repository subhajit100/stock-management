"use client";
import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import AddProductForm from "../components/AddProductForm";
import ProductTable from "../components/ProductTable";
// import { positions, Provider, useAlert } from "react-alert";
// import AlertTemplate from "react-alert-template-basic";
import Spinner from "../components/Spinner";
import { useAlert } from "react-alert";
import { useRouter } from "next/navigation";

// const options = {
//   timeout: 2000,
//   position: positions.TOP_RIGHT,
// };

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();
  const router = useRouter();

  useEffect(() => {
    // fetch the products based on the user loggedin from the db
    // TODO:- why the alert comes up, when we go to / route, without logging in
    async function fetchProducts() {
      if (!localStorage.getItem("auth-token")) {
        router.replace("/login");
        return;
      }
      setIsLoading(true);
      // I want here to fetch products only to the loggedin user
      const res = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        if (data.message === "Please authenticate with correct credentials") {
          alert.error(data.message);
          localStorage.removeItem("auth-token");
          router.replace("/login");
        } else {
          alert.error("Fetching products unsuccessful");
        }
      }
      setIsLoading(false);
    }
    fetchProducts();
  }, [alert]);

  return (
    <div className="text-center mx-10">
      {isLoading && <Spinner />}

      {/* {session && (
          <>
            Signed in as {session.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn('github')}>Sign in</button>
          </>
        )} */}
      <Search products={products} setProducts={setProducts} />
      <AddProductForm products={products} setProducts={setProducts} />
      <ProductTable products={products} setProducts={setProducts} />
    </div>
  );
};

export default HomePage;
