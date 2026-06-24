import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";


export async function POST(req: Request) {


  try {


    const {
      phone
    } = await req.json();



    if (!phone) {

      return NextResponse.json(
        {
          error: "Phone required"
        },
        {
          status: 400
        }
      );

    }



    // =========================
    // PHONE FORMAT
    // =========================

    let phoneNumber = phone
      .toString()
      .replace(/\D/g, "");



    // 017XXXXXXXX -> 88017XXXXXXXX

    if (phoneNumber.startsWith("01")) {

      phoneNumber =
        "88" + phoneNumber;

    }



    if (!phoneNumber.startsWith("8801")) {

      return NextResponse.json(
        {
          error:
          "Invalid Bangladesh phone number"
        },
        {
          status:400
        }
      );

    }





    // =========================
    // GENERATE OTP
    // =========================


    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();





    // =========================
    // SEND SMS
    // =========================


    const smsResponse =
      await fetch(
        "https://api.rtcom.xyz/onetomany",
        {

          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },


          body:JSON.stringify({

            acode:
            process.env.RT_ACODE,


            api_key:
            process.env.RT_API_KEY,


            senderid:
            process.env.RT_SENDER_ID,


            type:"text",


            msg:
            `Your Quick Treat verification OTP is ${otp}`,


            contacts:
            phoneNumber,


            transactionType:"T",


            contentID:""

          })

        }
      );





    const smsResult =
      await smsResponse.json();





    if(
      smsResult?.response?.code !== 200
    ){

      console.error(
        "SMS API Error:",
        smsResult
      );


      return NextResponse.json(
        {
          error:
          "SMS sending failed",
          details:
          smsResult
        },
        {
          status:500
        }
      );

    }







    // =========================
    // SAVE OTP DATABASE
    // =========================


    const {
      error
    } = await supabaseServer

      .from("sms_otps")

      .insert({

        phone:
        phoneNumber,


        otp,


        expires_at:
        new Date(
          Date.now()
          +
          5 * 60 * 1000
        )

      });





    if(error){

      console.error(
        "OTP DB Error:",
        error
      );


      return NextResponse.json(
        {
          error:
          "OTP save failed"
        },
        {
          status:500
        }
      );

    }







    return NextResponse.json(

      {
        success:true,

        message:
        "OTP sent successfully",

        requestID:
        smsResult?.info?.requestID

      }

    );





  }

  catch(error){


    console.error(
      "SEND OTP ERROR:",
      error
    );



    return NextResponse.json(

      {
        error:
        "OTP send failed"
      },

      {
        status:500
      }

    );


  }


}