import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { email } = reqBody;

    const user = await User.findOne({ email });
    console.log(user)

    if (!user) {
      return NextResponse.json(
        {
          error: "user does not exist"
        },
        { status: 400 }
      );
    }

    await sendEmail({email , emailType:"RESET", userId:user._id})

    return NextResponse.json({
      message:"Reset password token send successfully on email",
      status:200
    })
  
  
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    );
  }
}
