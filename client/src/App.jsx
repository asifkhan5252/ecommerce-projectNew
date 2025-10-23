

// import './App.css'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Aboutpage from './pages/Aboutpage'
import Contact from './pages/Contact'
import Policy from './pages/Policy'
import PageNotFound from './pages/PageNotFound'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import Dashboard from './pages/user/Dashboard'
import PrivateRoute from './components/Routes/PrivateRoute'
import ForgetPassword from './pages/Auth/ForgetPassword'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminRoute from './components/Routes/AdminRoute'
import CreateCategory from './pages/Admin/CreateCategory'
import Product from './pages/Admin/Product'
import Users from './pages/Admin/Users'
import Profile from './pages/user/Profile'
import Order from './pages/user/Order'
import AllProducts from './pages/Admin/AllProducts'
import UpdateProduct from './pages/Admin/UpdateProduct'
import Search from './pages/Search'
import ProductDetails from './pages/productDetails'
import Categories from './pages/Categories'
import CategoryWiseProduct from './pages/CategoryWiseProduct'
import CartPages from './pages/CartPages'
import AdminOrders from './pages/Admin/AdminOrders'
// import AdminOrders from './pages/user/Order'



function App() {
  

  return (
    <>
   <Routes>
     <Route path='/' element={<Homepage/>} />

     <Route path='/search' element={<Search/>} />

     <Route path='/categories' element={<Categories/>} />

     <Route path='/cart' element={<CartPages/>} />

     <Route path='/product-detail/:slug' element={<ProductDetails/>} />

        {/* Category Wise Products */}
        <Route path="/category/:slug" element={<CategoryWiseProduct />} />
     
     <Route path='/about' element={<Aboutpage/>} />
     {/* user ke liye */}
     <Route path='/dash' element={<PrivateRoute/>}>
       <Route path='user' element={<Dashboard/>} />
       <Route path='user/profile' element={<Profile/>} />
       <Route path='user/order' element={<Order/>} />
     </Route>
     {/* admin ke liye */}
     <Route path='/dash' element={<AdminRoute/>}>
       <Route path='admin' element={<AdminDashboard/>} />
       <Route path='admin/category' element={<CreateCategory/>} />
       <Route path='admin/allproducts/:slug' element={<UpdateProduct/>} />
       <Route path='admin/product' element={<Product/>} />
       <Route path='admin/allproducts' element={<AllProducts/>} />
       <Route path='admin/user' element={<Users/>} />
       <Route path='admin/allorders' element={<AdminOrders/>} />
     </Route>
    
     <Route path='/register' element={<Register/>} />
     <Route path='/forget-password' element={<ForgetPassword/>} />

     <Route path='/login' element={<Login/>} />
     <Route path='/contact' element={<Contact/>} />
     <Route path='/policy' element={<Policy/>} />
     <Route path='/*' element={<PageNotFound/>} />
     </Routes>
   
    </>
  )
}

export default App
