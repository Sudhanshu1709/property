const express = require('express');
const validator=require('validator');
const session=require("express-session");
const nodeMailer=require("nodemailer");
const mongooseDb=require("connect-mongodb-session")(session);
require('./db/config');
const User= require("./db/User");
const app= express();
const cors=require("cors");
const Product=require("./db/Product");
const Otp=require("./db/otp");


app.use(cors());
app.use(express.json());

// const muri="mongodb://localhost:27017/e-commerce";

// const store= new mongooseDb({
//     uri:muri,
//     collection:"session"
// })

// app.use(session({
//     secret:"hello123",
//     resave:false,
//     saveUninitialized:false, 
//     cookie:{secure:true},
//     store:store
// }));

function forValidation({name, email, password, phone}){
    console.log("..... ")
    return new Promise((resolve, reject)=>{
        const nameReg=/^[A-Za-z\s]+$/;
        const spaceReg=/^[\s]+$/;
        if( name==null || typeof(name)!=='string' || !name || !nameReg.test(name) || spaceReg.test(name) ){
            reject("Name is Invalid");
        }
        if(!email ||!validator.isEmail(email) || spaceReg.test(email)){
            reject("Email is invalid");
        }
        const regPhone=/^\d{10}$/;
        if(!phone || phone.length!==10 || !regPhone.test(phone)){
            reject("Phone number is invalid")
        }
        if(typeof(password)!=='string' || !password || spaceReg.test(password)){
            reject("Password is invalid");
        }
        if(password.length<5 || password.length>100){
            reject("password length should be greater than 5");
        }
        resolve();
    })
}
app.post("/register", async (req, resp)=>{
    // let user= new User(req.body);
    let {name, password, email, phone}=req.body;
    try{
       await forValidation({name, password, email, phone});
    }catch(err){
        return resp.send({
            status:400,
            error:err
        })
    }
    let user_dupicate={
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        phone:req.body.phone,
        isActive:false
    }
    let user= new User(user_dupicate);
    console.log("........?")
    try{
        let isEmail= await User.findOne({email:email});
        if(isEmail){
            if(isEmail.isActive===true){
                return resp.send({err:"Email already exists. Please login.", isActive:isEmail.isActive});
            }else{
                isEmail.name=req.body.name;
                isEmail.password=req.body.password;
                isEmail.phone=req.body.phone;
                await isEmail.save();
                otpGenrate(req,resp);
                return resp.send({
                    status:201,
                     message:"Please verify your email and otp send in email.",
                     isActive:isEmail.isActive
                    });
            }   
        }
    }catch(err){
        return resp.send({
            status:400,
            message:"Server error, please try again ."
        })
    }
    
    try{
        
        let result=await user.save();
   // console.log(resp);
   result=result.toObject();
   delete result.password;
    otpGenrate(req,resp);
    console.log(">>>>>>>>");
    resp.send(result);
    }catch(err){
        return resp.send({
            status:400,
            message:"Server error, please try again 2"
        })
    }
})

app.post("/login", async(req, resp)=>{
    if(req.body.password && req.body.email){
                let user=await User.findOne({email:req.body.email});//.select("-password");
                if(user){
                    if(user.isActive){
                        if(user.password===req.body.password){
                            // req.session.isauth=true;
                            // req.session.Useremail=user.email;
                            return resp.send({result_code:"1",id:user._id,name:user.name}); 
                            }else{
                                resp.send({message:'Please fill correct email and password.'});
                            }
                        }else{
                            resp.send({message:"Please ragister your email with email varifiction."})
                        }
                        
                    }else{
                        resp.send({message:'No user found.'});
                    }
                }else{
                    resp.send({message:'Please fill all fields.'})
                }
               

});

app.post("/add-product", async (req, resp)=>{
    let product=new Product(req.body);
    let result=await product.save();
    resp.send(result);
});

app.get("/products-list/:id", async(req, resp)=>{
    // if(!req.session.isauth){
    //     resp.send("You are not logged in. Please first login");
    // }
    let products=await Product.find({userId:req.params.id});
    if(products.length>0){
        resp.send(products);
    }else{
        resp.send({result:"No Product Found"});
    }
});

app.get("/products-list", async(req, resp)=>{
    // if(!req.session.isauth){
    //     resp.send("You are not logged in. Please first login");
    // }
    let products=await Product.find();
    if(products.length>0){
        resp.send(products);
    }else{
        resp.send({result:"No Product Found"});
    }
});

app.delete("/product/:id",async(req,resp)=>{
    let result=await Product.deleteOne({_id:req.params.id});
   // resp.send(result.deletedCount);
    if(result){
        resp.send(result);
    }else{
        resp.send({"delete":"Product is not available"});
    }
    
});

app.get("/product/:id", async(req, resp)=>{
    let result= await Product.findOne({_id:req.params.id });
    if(result){
        resp.send(result);
    }else{
        resp.send({"result":"No record found"});
    }
})

app.put("/product/:id", async(req,resp)=>{
    let result=await Product.updateOne({_id:req.params.id},{ $set:req.body});
    resp.send(result);
});

const otpGenrate=async (req,resp)=>{
    const data= await User.findOne({email:req.body.email});
    console.log("otp gen----");
    if(data.isActive==false){
        let otpGen='';
        for(let i=0;i<5;i++){
            let otp1= Math.floor(Math.random()*10);
            otpGen+=otp1;
        }
        const otpDataAvi= await Otp.findOne({email:req.body.email});
        if(otpDataAvi){
            otpDataAvi.code=otpGen;
            otpDataAvi.expireIn=new Date().getTime()+60*15*1000;
            const otpres=await otpDataAvi.save();
            if(otpres){
                mailer(req.body.email, otpGen);
                resp.send({
                    status:200,
                    statusText:'success',
                    message:"Please check your mail for otp."
                })
            }else{
                resp.send({
                    status:400,
                    statusText:'error',
                    message:"Server error, please try again. 3"
                    });
            }
        }else{
            let otpData=new Otp({
                email:req.body.email,
                code:otpGen,
                expireIn:new Date().getTime()+60*15*1000
            })
        
        let otpResponse=await otpData.save();
        if(otpResponse){
            mailer(req.body.email, otpGen);
            resp.send({
                status:200,
                statusText:'success',
                message:"Please check your mail for otp."
            })

        }else{
            resp.send({
                status:400,
                statusText:'error',
                message:"Server error, please try again. 4"
                });
            }
        }
    }else{
        resp.send({
            status:200,
            message:"Email already verified."
        });
    }
   
}

const mailer=(email,otp)=>{
    console.log("????????????");
    let transpoter= nodeMailer.createTransport({
        service:'gmail',
        port:587,
        secure:false,
        auth:{
            user:"sud170998@gmail.com",
            pass:"plxwnzvacvdwuisn"
        }
    });

    let mailOption={
        from:'noreply@gmail.com',
        to:email,
        subject:'Otp mail from property',
        html:`<h2 align="center" >Welcome</h2> <p align="center"> Otp is ${otp}. This otp will exipre in 15 minutes.</p>`
    }

    transpoter.sendMail(mailOption, (error, info)=>{
        if(error){
            console.log(error);
        }else{
            console.log('Email sent: '+info.response);
        }
    })
    console.log("???????2345?????");
}

app.post("/otp", async(req,resp)=>{
    if(!req.body.email || !req.body.otpcode ){
        resp.send({
            status:201,
            message:"Otp field required."
        })
    }
    const data=await Otp.findOne({email:req.body.email, code:req.body.otpcode});
    if(data){
        let diff=data.expireIn-(new Date().getTime());
        if(diff<0){
            resp.send({
                status:201,
                message:'Otp expired.'
            });
        }else{
            const userData=await User.findOne({email:req.body.email});
            if(userData){
                userData.isActive=true;
                let data_resp=userData.save();
                if(data_resp){
                    resp.send({
                        status:200,
                        message:"Email Verified."
                    })
                }else{
                    resp.send({
                        status:400,
                        message:"Server error, try again."
                    })
                }
            }else{
                resp.send({
                    status:201,
                    message:"Email dose not exists."
                })
            }
        }
    }else{
        resp.send({
            status:201,
            message:"Invalid otp."
        })
    }
   
})

app.listen(5000);


// const connectDB=async ()=>{
//     mongoose.connect('mongodb://localhost:27017/demo');
//     const productScheme=new mongoose.Schema({});
//     const product=mongoose.model('product', productScheme);
//     const data= await product.find();
//     console.warn(data);
// }
//  connectDB();
 

