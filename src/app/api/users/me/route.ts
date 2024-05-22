import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest){
    const {id}=getDataFromToken(request)

    const user= await User.findOne({_id:id}).select("-password")
    if (!user) {
        return NextResponse.json(
          {
            error: "Not Auhtorized",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          message: "User found",
          data:user
        },)




  

}