import React, {useState , useEffect} from 'react';
import { Link } from 'react-router-dom';

const MyProduct_List=()=>{
    const [products, setProducts]= useState([]);
    const id1={id:localStorage.getItem("auth")};
    useEffect(()=>{
        getProducts(id1.id);

    },[]);

    const getProducts=async(id)=>{

        let result=await fetch(`http://localhost:5000/products-list/${id}`);
        result=await result.json();
        setProducts(result);
    }

    const delete_product=async(id)=>{
        let result=await fetch(`http://localhost:5000/product/${id}`,{
            method:"Delete"
        });
        result=await result.json();
        if(result.deletedCount>0){
            getProducts();
            alert("Product deleted");
        }
    }
    
    return (
        <div className='product-list'>
            <h1>Property List</h1>
            <ul>
                <li>S. No.</li>
                <li>Name</li>
                <li>Price</li>
                <li>Property Size</li>
                <li>Address</li>
                <li>Action</li>
            </ul>
            {
                products.map((item,index)=>
                   <ul key={item._id}>
                        <li>{index+1}</li>
                        <li>{item.name}</li>
                        <li>{item.price}</li>
                        <li>{item.category}</li>
                        <li>{item.company}</li>
                        <li><button onClick={()=>delete_product(item._id)}>Delete</button>
                        <Link to={"/update/"+item._id}>Update</Link></li>
                    </ul>
                )
            }
            
        </div>
    );
}

export default MyProduct_List;