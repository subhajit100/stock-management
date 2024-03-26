import { NextResponse } from "next/server";
import connectToDB from "../database/connectToDB";
import Product from "../models/Product";

// id not required for GET and POST request
export async function GET(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const searchString = search ? search : "";
    const searchRegex = new RegExp(searchString, 'i');

    // finding all products with certain search string in name
    const products = await Product.find({ name: searchRegex });
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
    const { name, price, quantity } = await request.json();
    const newProduct = await Product.create({
      name,
      price,
      quantity,
    });
    if (newProduct) {
      return NextResponse.json(
        {
          success: true,
          message: "Product added successfully",
          product: newProduct
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
