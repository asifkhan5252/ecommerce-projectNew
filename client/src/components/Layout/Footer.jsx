import React from "react";
import { Link } from "react-router-dom";
// import './App.css'
const Footer = () => {
  return (
    <div className="footer">
      <h1 className="text-center text-xs">All Right Reserved &copy; Techinfoyt</h1>
      <p className="text-center mt-3">
       <Link className="footer-link" to="/about">About</Link>|
    <Link className="footer-link" to="/contact">Contact</Link>|
    <Link className="footer-link" to="/policy">Privacy Policy</Link>
    </p>
    </div>
  
  );
};

export default Footer;