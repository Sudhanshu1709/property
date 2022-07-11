import React from 'react';
import "./Login.css";

const Add_Product=()=>{
    
    const [name, setName]=React.useState("");
    const [price, setPrice]=React.useState("");
    const [category, setCategory]=React.useState("");
    const [company, setCompany]=React.useState("");
    const [error, setError]=React.useState(false);
    const userId=localStorage.getItem("auth");
    const Add_product_handle=async ()=>{
        console.warn(!name);
        console.log(name, price, category,company, userId);
        if(!name || !price || !category || !company){
            setError(true);
            return false;
        }
        let result= await fetch("http://localhost:5000/add-product",{
            method:'POST',
            body:JSON.stringify({name,price,category,company,userId}),
            headers:{
                "Content-Type":"application/json"
            }
        });
        result=await result.json();
        console.log(result);
        
        setName("");
        setCategory("");
        setCompany("");
        setPrice("");
        setError(false);
    }

    return (
        <>
        <h1 className='product-list'>Add Product</h1>
        <div className='login'>
            
            <input onChange={(e)=>setName(e.target.value)} type="text" placeholder='Enter property name' value={name}></input>
            {error && !name && <span className='validation_message'>Enter valid name</span>}
            <input onChange={(e)=>setPrice(e.target.value)} type="text" placeholder='Enter property price' value={price}></input>
            {error && !price && <span className='validation_message'>Enter valid price</span>}
            <input onChange={(e)=>setCategory(e.target.value)} type="text" placeholder='Enter property size' value={category}></input>
            {error && !category && <span className='validation_message'>Enter valid category</span>}
            <input onChange={(e)=>setCompany(e.target.value)} type="text" placeholder='Enter full property address' value={company}></input>
            {error && !company && <span className='validation_message'>Enter valid company</span>}
            <button onClick={Add_product_handle} type="button" className='LoginButton'>Add Product</button>
        </div>
        </>
    );
};

export default Add_Product;