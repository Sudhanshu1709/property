import React from 'react';
import './Login.css';
import {useNavigate} from 'react-router-dom';

const Login=()=>{
    const [email, setEmail]=React.useState("");
    const [password, setPassword]=React.useState("");
    const navigate=useNavigate();
    const auth=localStorage.getItem('user');
   
    React.useEffect(()=>{
        if(auth){
        navigate('/');
        }
    });
    const handleLogin=async ()=>{
        console.log(email);
        console.log(password);
        
        let result=await fetch("http://localhost:5000/login",{
            method:'POST',
            body:JSON.stringify({email, password}),
            headers:{
                'Content-Type':'application/json'
            }
        });

        result=await result.json();
        console.log(result);
        
        if(result.result_code==="1"){
            localStorage.setItem("auth",result.id);
            localStorage.setItem("name",result.name);
            navigate('/');
        }else{
            alert(result.message);
        }
        setEmail("");
        setPassword("");
        
    }
    return(
        <div className='login'>
            <div>
                <input type="email" placeholder='Enter Email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
                <input type="password" placeholder='Enter Password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
                <button className='LoginButton' onClick={handleLogin} type='button'>Login</button>
                
            </div>

        </div>
    );
}
export default Login;