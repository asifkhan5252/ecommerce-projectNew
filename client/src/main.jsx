// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Context/Auth.jsx'
import "antd/dist/reset.css";
import { SearchProvider } from './Context/Search.jsx'
import { CartProvider } from './Context/Cart.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <SearchProvider>
  <CartProvider>
  <BrowserRouter>
 {/* <StrictMode> */}
    <App />
  {/* </StrictMode> */}
  </BrowserRouter>
  </CartProvider>
  </SearchProvider>
  </AuthProvider>
 
)
