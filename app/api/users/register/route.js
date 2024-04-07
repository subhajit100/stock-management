import { NextResponse } from "next/server";
import connectToDB from "../../database/connectToDB";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { saltRounds } from "@/app/lib/common";

export async function POST(request) {
  try {
    await connectToDB();

    const { username, email, password } = await request.json();
    // change the password to hashedpassword before storing it to db
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    
    // some checks before creating a new user in db
    // check if user with same email already exists?
    const user = await User.find({ email });
    if (user && user.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 404 }
      );
    }
    // if not, we can create a user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // create a jwt token by using jwt.sign and then return the authToken in headers of response
      const data = { user: { id: newUser._id } };
      const authToken = jwt.sign(data, process.env.JWT_KEY, { expiresIn: "5h" });

      const response = NextResponse.json(
        {
          success: true,
          message: "User added successfully",
          user: newUser,
        },
        { status: 201 }
      );
      response.headers.set("auth-token", authToken);
      return response;
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Error while creating a new User",
        },
        { status: 404 }
      );
    }
  } catch (err) {
    console.log("error while POST request", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error while creating a new User",
      },
      { status: 404 }
    );
  }
}
