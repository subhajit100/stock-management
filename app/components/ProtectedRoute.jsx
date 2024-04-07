// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
'use client';
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  // TODO:- if localstorage has authtoken then fine, else, redirect to login.
  const router = useRouter();
  useEffect(() => {
    if(!localStorage.getItem('auth-token')){
        router.replace('/login');
    }
  }, [router]);
  
  return <>{children}</>;
};

export default ProtectedRoute;
