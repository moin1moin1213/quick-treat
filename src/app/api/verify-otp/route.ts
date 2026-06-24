import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";


export async function POST(req:Request){


const {
phone,
otp
}=await req.json();



const {
data
}=await supabase
.from("sms_otps")
.select("*")
.eq("phone",phone)
.eq("otp",otp)
.eq("verified",false)
.single();



if(!data){

return NextResponse.json(
{
success:false,
message:"Invalid OTP"
}
)

}




if(
new Date(data.expires_at)
<
new Date()
){

return NextResponse.json(
{
success:false,
message:"OTP expired"
}
)

}




await supabase
.from("sms_otps")
.update({
verified:true
})
.eq(
"id",
data.id
);



return NextResponse.json(
{
success:true
}
)


}