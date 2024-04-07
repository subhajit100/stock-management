import { NextResponse } from "next/server";
import connectToDB from "../../database/connectToDB";
import Product from "../../models/Product";
import { findIfUserAuthenticated } from "../../customMiddleware";

export async function PATCH(request, { params }) {
  try {
    await connectToDB();
    const body = await request.json();
    const { id } = params;

    const { data, authenticateResponse } = findIfUserAuthenticated(request);
    // this will be returned if it is set in the middleware
    if (authenticateResponse != null) {
      return authenticateResponse;
    }

    // find the product with that id
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Error while updating the product" },
        { status: 404 }
      );
    }

    // check if the product's owner user and the presented authenticated user id are same
    if (product.user.toString() !== data.user.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Not allowed to update product, please authenticate with correct credentials",
        },
        { status: 404 }
      );
    }

    // update the product with given id
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });
    if (updatedProduct) {
      return NextResponse.json(
        {
          success: true,
          message: "Successfull while updating the product with id",
          product: updatedProduct,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Error while updating the product" },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error while updating the product" },
      { status: 404 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    const { data, authenticateResponse } = findIfUserAuthenticated(request);
    // this will be returned if it is set in the middleware
    if (authenticateResponse != null) {
      return authenticateResponse;
    }

    // find if some product with the given id
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Error while deleting the product" },
        { status: 404 }
      );
    }

    // check if the product's owner user and the presented authenticated user id are same
    if (product.user.toString() !== data.user.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Not allowed to delete product, please authenticate with correct credentials",
        },
        { status: 404 }
      );
    }

    // as the product exists, so delete the product now
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      return NextResponse.json(
        {
          success: true,
          message: "Successfull DELETE request",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Error while deleting the product" },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error while deleting the product" },
      { status: 404 }
    );
  }
}
