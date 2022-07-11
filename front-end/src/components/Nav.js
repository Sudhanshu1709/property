import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import "./Nav.css";

const Nav=()=>{
    const auth=localStorage.getItem('auth');
    const name=localStorage.getItem('name');
    const naviagte=useNavigate();
    const Logout=()=>{
        localStorage.clear();
        naviagte("/signup");
    }
    return (
        <div>
            <img className="logo" alt="logo" src="https://raddevon.com/wp-content/uploads/2018/10/react.jpg"/>
            { auth?<ul className="nav-ul">
             <li><Link to="/"> Property</Link></li>
                <li><Link to='/myproperty'>My Property</Link></li>
                <li><Link to="/add">Add Property</Link></li>
                {/* <li><Link to="/update">Update Products</Link></li> */}
                <li><Link to="/profile">Profile</Link></li>
                {/* <li>{auth?<Link onClick={Logout} to="/signup">Logout</Link>:<Link to="/signup">SignUp</Link>} </li>
                <li><Link to="/login">Login</Link></li> */}
               <li><Link onClick={Logout} to="/login">Logout  ({name})</Link></li></ul>
               :
               <ul className="nav-ul nav-right">
                    <li><Link to="/signup">SignUp</Link></li>
                    <li><Link to='/login'>Login</Link></li>
            </ul>
        }
        </div>
    );  
}

export default Nav;