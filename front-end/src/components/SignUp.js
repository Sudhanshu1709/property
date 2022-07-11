import React, {useState, useEffect} from "react";
import "./SignUp.css";
import Otp from "./Otp";
import { Navigate, useNavigate } from "react-router-dom";


const SignUp=()=>{
    const [name, setName]=useState("");
    const [password, setPassword]=useState("");
    const [email, setEmail]=useState("");
    const [phone, setPhone]=useState("");
    const [conPassword, setConPassword]=useState("");
    const [error, setError]=useState(false);
    const [success, setSuccess]=useState(false);
   // const [otp, setOtp]=useState("");
   const navigate =useNavigate();
   const auth=localStorage.getItem('user');
    
    useEffect(()=>{
        if(auth){
        navigate('/');
        }
    },[]);

    const collectData=async ()=>{
        if(!name || !email || !password || !phone || !conPassword || conPassword!==password){
            setError(true);
            return false;
        }
        setError(false);
        
        console.log(name, email, password,phone);
        let result=await fetch("http://localhost:5000/register",{ // async await use kr sakte beside of promise(then)
            method:'POST',
            body:JSON.stringify({name, email, password,phone}), //api json stringfy se parameter leta hai
            headers:{
                'Content-Type':'application/json'
            }
        });
       result=await result.json();
        console.warn(result);
  
        if(!result.error){
            if(!result.isActive)
            {// localStorage.setItem("user", JSON.stringify(result));
                setSuccess(true);
            alert("User successfully registered please check your mail for otp.");
         //   navigate('/otp');
            // setName("");
            // setEmail("");
            // setPhone("");
            // setPassword("");
            // setConPassword("");
            
        }else{
            alert("Email is already exists.");
        }
        }else{
            alert(result.error);
        }     
    }

   

    return(
        <>
        {!success? <div className="register">
            <h1 className="register1">Register</h1>
            <input className="inputbox" value={name} type="text" onChange={(event)=>setName(event.target.value)} placeholder="Enter Name"/>
            {error && !name && <span>Name is required</span>}
            <input className="inputbox" value={email} type="email" onChange={(event)=>setEmail(event.target.value)} placeholder="Enter Email"/>
            {error && !email && <span>Email is required</span>}
            <input className="inputbox" value={phone} type="number" onChange={(e)=>setPhone(e.target.value)} placeholder="Enter contact number"/>
            {error && !phone && <span>Number is required</span>}
            <input className="inputbox" value={password} type="password" onChange={(event)=>setPassword(event.target.value)} placeholder="Enter password"/>
            {error && !password && <span>Password is required</span>}
            <input className="inputbox" value={conPassword} type="text" onChange={(e)=>setConPassword(e.target.value)} placeholder="Enter confirm password"/>
            {error && <span>Password are not matched</span>}
            <button className="signupButton" type="button" onClick={collectData}>SignUp</button>
        </div>:
         <Otp email_id={email}/>
        
     }
        </>
    );
}

export default SignUp;