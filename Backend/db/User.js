const mongoose =require('mongoose');

const userSchema =new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    phone:{type:String, required:true},
    isActive:Boolean(false)
});

module.exports=mongoose.model("users",userSchema); // first parameter is table name and second schema, and model as releted tables.