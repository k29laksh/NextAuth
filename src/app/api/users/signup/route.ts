import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/sendEmail";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

  const{username,email,password}=reqBody;

  const existingUser= await User.findOne({email})

  if(existingUser)
    {
       return NextResponse.json({
              error:"User already exists"
        },
   { status:400})
    }

    const salt = await bcryptjs.genSalt(10);

    const hashPassword= await bcryptjs.hash(password,salt)

    const newUser= new User({
        username,
        email,
        password:hashPassword
    })

    const savedUser= await newUser.save()
    console.log(savedUser)

    // send verification mail

    await sendEmail({email,emailType:"VERIFY", userId:savedUser._id})

    return NextResponse.json(
        {
          message: "User registered successfully",
          success:true,
          savedUser
        },)


  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
