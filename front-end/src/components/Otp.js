import React, {useEffect, useState} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import "./SignUp.css";

const Otp=(props)=>{
    const [otpcode, setOtp]=useState("");
    const [email, setEmail]=useState("");
    const [back, setBack]=useState(false);
    const navigate=useNavigate();
   // const [email_id, setEmail]=useState(props.email_id);
  //  setEmail(props);
  //  console.log(props, otp);
  useEffect(()=>{
    setEmail(props.email_id);
  },[]) ;
    const otpAttech=async ()=>{
        console.log(email, otpcode); 
        let result=await fetch("http://localhost:5000/otp",{ // async await use kr sakte beside of promise(then)
            method:'POST',
            body:JSON.stringify({email,otpcode}), //api json stringfy se parameter leta hai
            headers:{
                'Content-Type':'application/json'
            }
        });
        result=await result.json();
        if(result.status===200){
            navigate("/login");
            alert(result.message);
        }else{
            alert(result.message);
        }
        
       
    }

    const backAttach=()=>{
        setBack(true);
    }

    return (
        <>
        { !back?<div className="register">
            <h1>Otp</h1>
            <div>
                <input className="inputbox" type="text" onChange={(event)=>setOtp(event.target.value)} value={otpcode} placeholder="Enter Otp" />
                <button className="signupButton" type="button" onClick={otpAttech}>Submit</button>
                <button className="signupButton" type="button" onClick={backAttach}>Back</button>
            </div>
        </div>:
        <SignUp/>
        }
        </>
        
    )
}

export default Otp;