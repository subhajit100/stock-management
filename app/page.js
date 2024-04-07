"use client";
import { useEffect } from "react";
// import { getServerSession } from "next-auth";
// import { fetchProducts } from "./lib/data";
import HomePage from "./pages/HomePage";
import { useRouter } from "next/navigation";


// import { redirect } from 'next/navigation'

export default function Home() {
  //   const session = await getServerSession();
  //   let products=null;
  // TODO:- check if localstorage has authtoken in it. If yes then fetch products, else redirect to login page
  //   products = JSON.parse(JSON.stringify(await fetchProducts()));
  //   if(session && session.user){
  //     products = JSON.parse(JSON.stringify(await fetchProducts()));
  //   }
  //   else{
  //     redirect('/login');
  //   }

  // second method using route handlers
  //   const res = await fetch("http://localhost:3000/api/products");
  //   const data = await res.json();
  //   const products = data.products;

  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      router.replace("/login");
    }
  }, [router]);

  return (
    // <>{session?.user?.name ? <HomePage initialProducts={products} /> : null}</>
    // <HomePage initialProducts={products} />
      <HomePage />
  );
}
