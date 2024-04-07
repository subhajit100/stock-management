// import { signIn, useSession } from "next-auth/react";
"use client";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { useAlert } from "react-alert";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password || !email) {
      alert.error("please enter all the input fields");
      return;
    }

    setIsLoading(true);
    // making the api call here
    const res = await fetch("/api/users/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      // TODO:- check if is safe to send password like this or encrypt it?
      body: JSON.stringify({ password, email }),
    });
    const data = await res.json();
    // go inside successful message only if both success and header present in response
    const authToken = res.headers.get("auth-token");
    if (data.success && authToken) {
      alert.success("User login successful");
      localStorage.setItem("auth-token", authToken);
    } else {
      alert.error("User login unsuccessful");
      setIsLoading(false);
      //TODO:-  remove authtoken from localstorage
      localStorage.removeItem("auth-token");
      return;
    }

    // Reset form fields after adding
    setPassword("");
    setEmail("");
    setIsLoading(false);
    router.replace("/");
  };

  // TODO:- also in the UI , add a button to go to register route, if person is not signed up till now

  return (
    <div className="mx-10 text-center">
      {isLoading && <Spinner />}
      <div className="flex justify-start mt-5 mb-3 text-xl font-semibold">
        Login
      </div>

      <form onSubmit={handleSubmit} className="mt-4 text-left">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="text"
            id="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>

      <div className="flex items-center justify-start space-x-4 mt-5">
        <p className="text-gray-600 text-sm">Not a member, please signup</p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => {
            router.push('/register');
          }}>
            Sign Up
          </button>
      </div>
    </div>
  );
};

export default LoginPage;
