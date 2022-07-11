import React, {useEffect,useState} from "react";

const ProductList=()=>{

    const [properties, setProperty]= useState([]);
    
    useEffect(()=>{
        getProducts();

    },[]);

    const getProducts=async()=>{

        let result=await fetch("http://localhost:5000/products-list");
        result=await result.json();
        setProperty(result); 
    }

    return(
        <div className='product-list'>
            <h1>Property List</h1>
            <ul>
                <li>S. No.</li>
                <li>Name</li>
                <li>Price</li>
                <li>Property Size</li>
                <li>Address</li>
            </ul>
            {
                properties.map((item,index)=>
                   <ul key={item._id}>
                        <li>{index+1}</li>
                        <li>{item.name}</li>
                        <li>{item.price}</li>
                        <li>{item.category}</li>
                        <li>{item.company}</li>
                    </ul>
                )
            }
            
        </div>
    )
}
 export default ProductList;