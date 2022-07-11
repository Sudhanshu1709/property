import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const Update_product=()=>{

    const [name, setName]=useState('');
    const [price, setPrice]=useState('');
    const [category, setCategory]=useState('');
    const [company, setCompany]=useState('');
    const params=useParams();
    const Navigate=useNavigate();

    useEffect(()=>{
        getProductDetails();
    },[]);

    const getProductDetails=async ()=>{
        console.log(params);
        let result=await fetch(`http://localhost:5000/product/${params.id}`);
        result=await result.json();
        console.log(result);
        if(result){
            setName(result.name);
            setPrice(result.price);
            setCategory(result.category);
            setCompany(result.company);
        }
    }
    const update_product= async()=>{
        let result=await fetch(`http://localhost:5000/product/${params.id}`,{
            method:"put",
            body:JSON.stringify({name,price,category,company}),
            headers:{
                "Content-Type":"application/json"
            }
        });
        result=await result.json();
        console.log(result);
        if(result){
            alert("Product updated successfully");
            Navigate("/");
        }
        
    }

    return (
        <div>
            <h1>Update Property</h1>
            <input type="text" placeholder='Enter property name' className="inputBox"
              value={name} onChange={(e)=>setName(e.target.value)} />
              <input type="text" placeholder='Enter property price' className="inputBox"
              value={price} onChange={(e)=>setPrice(e.target.value)} />
              <input type="text" placeholder='Enter property category' className="inputBox"
              value={category} onChange={(e)=>setCategory(e.target.value)} />
              <input type="text" placeholder='Enter property address' className="inputBox"
              value={company} onChange={(e)=>setCompany(e.target.value)} />
              <button type="button" onClick={update_product}>Update Product</button>
        </div>
    );
}

export default Update_product;