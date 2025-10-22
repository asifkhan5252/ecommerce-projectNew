import order from "../models/order.js";
import User from "../models/userModel.js";
// import bcrypt from 'bcrypt';

import { hashPassword } from "../utills/hashpassword.js";
import { comparePassword } from "../utills/hashpassword.js";
import jwt from "jsonwebtoken";
// Register Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, Address,answer } = req.body;

    //  Check if user already exists
    // const existingUser = await User.findOne({ email });
    if (!name || !email || !password || !phone || !Address || !answer) {
      return res.status(409).json({ message: "All field require" });
    }

    // if(!name){
    //   return res.send({message:"name is require"})
    // }
    // if(!email){
    //   return res.send({message:"email is require"})
    // }
    // if(!password){
    //   return res.send({message:"password is require"})
    // }
    // if(!phone){
    //   return res.send({message:"phone is require"})
    // }
    // if(!Address){
    //   return res.send({message:"address is require"})
    // }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(209)
        .json({ success: false, message: "Already register please login" });
    }
    //  Hash password
    const hashedPassword = await hashPassword(password);

    //  Create user
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      phone,
      Address,
      answer,
    }).save();

    await newUser.save();

    res.status(200).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid compare password" });

      // token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
     // Success
    res.status(200).json({
        success:true,
        message: "Login successful",
        user: { name: user.name, Address: user.Address, email: user.email, id: user._id,role:user.role,phone:user.phone },
        token,
      });

  

   
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;

    if (!email || !newPassword || !answer) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    //  check
    const user=await User.findOne({email,answer})
    if(!user){
      return res.status(404).send({
        success:false,
        message:"wrong email or question"
      })
    }
    const hash=await hashPassword(newPassword)
    await User.findByIdAndUpdate(user._id,{password:hash})
res.status(200).send({success:true,message:"password reset success"})
  }catch(error){
    console.log(error)
    res.status(500).send({success:false,message:"something is wrong",error})
    // res.status(200).send({success:true,message:"password reset successfull"})
    
  }
}

export const protectedroute = (req, res) => {
  res.send("protected route");
};


export const updateProfileController = async (req, res) => {
  try {
    const { name, password, Address, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (password && password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
         Address: Address || user.Address,
        phone: phone || user.phone,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};


//  Get all orders (Admin only)
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await order.find({buyer:req.user._id})
      .populate("products", "-photo").populate("buyer","name")
      // .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

//  all orderby admin
export const getAllAdminOrdersController = async (req, res) => {
  try {
    const orders = await order.find({})
      .populate("products", "-photo").populate("buyer","name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};


// ✅ Update Order Status Controller (Admin Only)
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const updatedOrder = await order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};
