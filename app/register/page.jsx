"use client";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { useAlert } from "react-alert";
import { useRouter } from "next/navigation";

// TODO:- form validation using react-hook-form and shift it from backend to frontend
const SignupPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password || !email) {
      alert.error("please enter all the input fields");
      return;
    }

    setIsLoading(true);
    // making the api call here
    const res = await fetch("/api/users/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      // TODO:- check if is safe to send password like this or encrypt it?
      body: JSON.stringify({ username, password, email }),
    });
    const data = await res.json();
    // go inside successful message only if both success and header present in response
    const authToken = res.headers.get("auth-token");
    if (data.success && authToken) {
      alert.success("User signed up successfully");
      localStorage.setItem("auth-token", authToken);
    } else {
      alert.error("User signup unsuccessful");
      setIsLoading(false);
      //TODO:-  remove authtoken from localstorage
      localStorage.removeItem("auth-token");
      return;
    }

    // Reset form fields after adding
    setUsername("");
    setPassword("");
    setEmail("");
    setIsLoading(false);
    // TODO:- set localstorage authtoken to returned from response
    router.replace("/");
  };

  // TODO:- also in the UI , add a button to go to login route, if person is already signed in

  return (
    <div className="mx-10 text-center">
      {isLoading && <Spinner />}
      <div className="flex justify-start mt-5 mb-3 text-xl font-semibold">
        Register
      </div>

      <form onSubmit={handleSubmit} className="mt-4 text-left">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 sm:text-sm"
          />
        </div>
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
          Signup
        </button>
      </form>

      <div className="flex items-center justify-start space-x-4 mt-5">
        <p className="text-gray-600 text-sm">Already a member, please login</p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => {
            router.push('/login');
          }}>
            Login
          </button>
      </div>
    </div>
  );
};

export default SignupPage;
