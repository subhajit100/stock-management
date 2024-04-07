"use client";

import React, { useEffect, useRef, useState } from "react";
import SearchedProducts from "./SearchedProducts";
import Spinner from "./Spinner";
import { useAlert } from "react-alert";
import { useRouter } from "next/navigation";

const Search = ({ products, setProducts }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const alert = useAlert();
  const router = useRouter();

  let timeoutId = useRef(null);
  // this searchRef actually required to select the div which encloses input search element and the search suggestion div also. In this way whenever we click out of this section, then only searchresults disappear. Before this, only on clicking + and - of searchResults, the results were disappearing.
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // click outside the area
        setIsSearchFocused(false);
        setSearchProducts([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery.length > 3) {
      // added debouncing of 1000ms for input change
      debounceProductsCall(searchQuery);
    } else {
      setSearchProducts([]);
    }
  };

  const handleDecrease = async (product) => {
    let { name, price, quantity } = product;
    if (quantity <= 0) {
      return;
    }

    quantity -= 1;

    setIsLoading(true);
    // write the logic to decrease the quantity on the backend with id
    const res = await fetch(`/api/products/${product._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ name, price, quantity }),
    });
    const data = await res.json();

    // check if data message has anything related to unauthorized access, then redirect to login
    if (data.message === "Please authenticate with correct credentials") {
      alert.error(data.message);
      localStorage.removeItem("auth-token");
      router.replace("/login");
      return;
    }

    // set in the frontend also
    const updatedSearchProducts = searchProducts.map((searchProduct) => {
      if (product._id === searchProduct._id) {
        return data.product;
      }
      return searchProduct;
    });

    setSearchProducts(updatedSearchProducts);
    // also update on main products list

    setProducts(
      products.map((pr) => {
        if (pr._id === product._id) {
          return data.product;
        }
        return pr;
      })
    );
    setIsLoading(false);
  };

  const handleIncrease = async (product) => {
    let { name, price, quantity } = product;
    quantity += 1;
    setIsLoading(true);
    // write the logic to increase the quantity on the backend with id
    const res = await fetch(`/api/products/${product._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ name, price, quantity }),
    });
    const data = await res.json();

    // check if data message has anything related to unauthorized access, then redirect to login
    if (data.message === "Please authenticate with correct credentials") {
      alert.error(data.message);
      localStorage.removeItem("auth-token");
      router.replace("/login");
      return;
    }

    // set in the frontend also
    const updatedSearchProducts = searchProducts.map((searchProduct) => {
      if (product._id === searchProduct._id) {
        return data.product;
      }
      return searchProduct;
    });

    setSearchProducts(updatedSearchProducts);
    // also update on main products list
    setProducts(
      products.map((pr) => {
        if (pr._id === product._id) {
          return data.product;
        }
        return pr;
      })
    );
    setIsLoading(false);
  };

  const debounceProductsCall = async (query) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      getProductsBasedOnQuery(query);
      timeoutId.current = null;
    }, 1000); // giving 1000ms of debounce time
  };

  const getProductsBasedOnQuery = async (query) => {
    // this method is by making api call
    // setIsLoading(true);
    // const urlString = `/api/products?search=${query}`;
    // // TODO: handle error part also
    // const res = await fetch(urlString);
    // const data = await res.json();
    // setSearchProducts(data.products);

    // this method is by taking the data from products state passed from parent
    const productsBasedOnSearch = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchProducts(productsBasedOnSearch);
    setIsLoading(false);
  };

  const handleSearchQueryChange = async (e) => {
    const newSearchQuery = e.target.value;
    // make api call only when length of string greater than 3
    if (newSearchQuery.length > 3) {
      // added debouncing of 1000ms for input change
      debounceProductsCall(newSearchQuery);
    } else {
      setSearchProducts([]);
    }

    setSearchQuery(newSearchQuery);
  };

  return (
    <div className="relative">
      {isLoading && <Spinner />}
      <div
        className={`flex flex-col ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex justify-start my-3 text-xl font-semibold">
          Search a product
        </div>
        <div className="flex flex-col" ref={searchRef}>
          <div className="flex w-full md:justify-start justify-center items-end">
            <div className="relative mr-4 md:w-full lg:w-full xl:w-3/4 w-3/4">
              <input
                type="text"
                value={searchQuery}
                onFocus={handleSearchFocus}
                onChange={handleSearchQueryChange}
                className="w-full bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          {searchProducts.length > 0 && isSearchFocused && (
            <div className="relative">
              <SearchedProducts
                products={searchProducts}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
