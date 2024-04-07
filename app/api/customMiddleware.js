import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// TOOD;- unauthorized access status code change from 404 -> 401
export function findIfUserAuthenticated(request){
    const authToken = request.headers.get("auth-token");
    // this will get the value only if we do not get the user.id inside data
    let authenticateResponse = null;
    let data = null;
    try{
        data  = jwt.verify(authToken, process.env.JWT_KEY);
        if (!data?.user?.id) {
            authenticateResponse =  NextResponse.json(
              {
                success: false,
                message: "Please authenticate with correct credentials",
              },
              { status: 404 }
            );
          }
    }
    catch(err){
        authenticateResponse =  NextResponse.json(
            {
              success: false,
              message: "Please authenticate with correct credentials",
            },
            { status: 404 }
          );
    }
    
    return {data, authenticateResponse};
}