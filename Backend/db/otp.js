const mongoose=require("mongoose");


var otpShecma=new mongoose.Schema({
    email: String,
    code:String,
    expireIn:Number
},{
    timestamps:true
});
module.exports=mongoose.model("otp", otpShecma);

