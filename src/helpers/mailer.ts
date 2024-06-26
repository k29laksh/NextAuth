

import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";


export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // console.log("hashedToken: ", hashedToken)
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "zdead0505@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: emailType === "VERIFY" ? `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to 
          or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
          </p>` :
        `<p>Click <a href="${process.env.DOMAIN}/verifytokenandresetpassword?token=${hashedToken}">here</a> to 
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifytokenandresetpassword?token=${hashedToken}
            </p>`,
      // `<p>Click <a href="${
      //   process.env.DOMAIN
      // }/verifyemail?token=${hashedToken}">here</a> to 
      //   or copy and paste the link below in your browser. <br> ${
      //     process.env.DOMAIN
      //   }/verifyemail?token=${hashedToken}
      //   </p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
