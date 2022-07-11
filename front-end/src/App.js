
import {  BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Nav from './components/Nav';
import SignUp from './components/SignUp';
import PrivateComponent from './components/PrivateComponent';
import Login from './components/Login';
import Product from './components/Add_Product';
import MyProduct_list from './components/MyProduct_list';
import ProductList from './components/ProductList';
import Update_Product from './components/Update_product';
//import Otp from './components/Otp';

function App() {
  return ( 
    <div className="App">
      
      < BrowserRouter>
         <Nav></Nav>
        <Routes>
          <Route element={<PrivateComponent/>}>
          <Route path='/' element={<ProductList/>}/>
          <Route path='/myproperty' element={<MyProduct_list/>}/>
          <Route path='/add' element={<Product/>}/>
          <Route path='/update/:id' element={<Update_Product />}/>
          <Route path='/logout' element={<h1>hello logout</h1>}/>
          <Route path='/profile' element={<h1>hello profile</h1>}/>
          </Route>

          <Route path='/signup' element={<SignUp/>} />
          <Route path='/Login' element={<Login/>} />
        </Routes>
      </BrowserRouter>
      <Footer></Footer>
    </div>
  );
}

export default App;
