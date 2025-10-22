import express from 'express';
import { forgetPasswordController, getAllAdminOrdersController, getAllOrdersController, loginUser, protectedroute, registerController, updateOrderStatusController, updateProfileController } from '../controllers/authController.js';
import {  verifytoken ,isadmin} from '../middlewares/authMiddleware.js';

const router=express.Router()

router.post("/register",registerController)
router.post("/login",loginUser)
router.get('/protected', verifytoken,isadmin,protectedroute, (req, res) => {
  res.status(200).json({ message: "This is a protected route", user: req.user });
});

router.post('/forget-password',forgetPasswordController)
// user protected route auth
router.get("/user-auth",verifytoken ,(req,res)=>{
  res.status(200).send({ ok:true})

})
//Admin protect rout
router.get("/admin-auth",verifytoken , isadmin,(req,res)=>{
  res.status(200).send({ ok:true})

})

// routes/authRoutes.js
router.put("/profile", verifytoken, updateProfileController);

// 🧾 Get all orders (admin)
router.get("/all-orders", verifytoken, getAllOrdersController);


// 🧾 Get all orders (admin)
router.get("/all-orders-admin", verifytoken,isadmin , getAllAdminOrdersController);

router.put("/update-status/:orderId", verifytoken, isadmin, updateOrderStatusController);
export default router