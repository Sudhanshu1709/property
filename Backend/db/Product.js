const mongoose = require("mongoose");

const productScheme=new mongoose.Schema({
    name:{type:String, required:true},
    price:{type:String, required:true},
    category:{type:String, required:true},
    userId:String,
    company:{type:String, required:true}
});
module.exports=mongoose.model("products", productScheme);