import { NextResponse } from "next/server";
import connectToDB from "../database/connectToDB";
import Product from "../models/Product";
import jwt from "jsonwebtoken";
import { findIfUserAuthenticated } from "../customMiddleware";

// id not required for GET and POST request
export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const searchString = search ? search : "";
    const searchRegex = new RegExp(searchString, "i");

    const { data, authenticateResponse } = findIfUserAuthenticated(request);
    // this will be returned if it is set in the middleware
    if (authenticateResponse != null) {
      return authenticateResponse;
    }

    // finding all products with certain search string in name, as well as particular user id
    const products = await Product.find({
      name: searchRegex,
      user: data.user.id,
    });
    if (products) {
      return NextResponse.json(
        {
          success: true,
          message: "Successfull while fetching products",
          products,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Error while fetching products" },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error while fetching products" },
      { status: 404 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const { data, authenticateResponse } = findIfUserAuthenticated(request);
    // this will be returned if it is set in the middleware
    if (authenticateResponse != null) {
      return authenticateResponse;
    }

    const { name, price, quantity } = await request.json();
    const newProduct = await Product.create({
      user: data.user.id,
      name,
      price,
      quantity,
    });
    if (newProduct) {
      return NextResponse.json(
        {
          success: true,
          message: "Product added successfully",
          product: newProduct,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Error while creating a new Product",
        },
        { status: 404 }
      );
    }
  } catch (err) {
    console.log("error while POST request", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error while creating a new Product",
      },
      { status: 404 }
    );
  }
}
