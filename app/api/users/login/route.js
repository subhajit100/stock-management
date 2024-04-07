import { NextResponse } from "next/server";
import connectToDB from "../../database/connectToDB";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    await connectToDB();

    const { email, password } = await request.json();
    // check if user with same email does not already exist?
    const user = await User.find({ email });

    // if user does not exists , then return error response
    if (!user || user.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist",
        },
        { status: 404 }
      );
    }
    // if user exists, check if password is correct?
    const isPasswordCorrect = bcrypt.compareSync(password, user[0].password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password",
        },
        { status: 404 }
      );
    }

    // if user exists and password correct, then create an auth token using jwt and return a response by adding that jwt token inside headers
    const data = { user: { id: user[0]._id } };
    // TODO:- make the JWT to only last for 1 hour
    const authToken = jwt.sign(data, process.env.JWT_KEY, { expiresIn: "30000" });

    const response = NextResponse.json(
      {
        success: true,
        message: "User logged in successfully",
      },
      { status: 201 }
    );
    response.headers.set("auth-token", authToken);
    return response;
  } catch (err) {
    console.log("error while logging in a user ", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error while logging in a User",
      },
      { status: 404 }
    );
  }
}
