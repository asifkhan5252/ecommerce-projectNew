
import dotenv from "dotenv"
dotenv.config();
import express from "express"

import connectDB from "./config/db.js";
import authRoute from './routes/authRoute.js';
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoute.js"
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors"
import path from "path"



const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join,(__dirname,'./client/dist')))

//middele ware
// app.use(bodyParser.json());

//connect mongodb
// const mongoURI="mongodb://localhost:27017/Storedata"
// mongoose.connect(mongoURI)
// .then(()=>
//     console.log("mongodb connect sussecfully"))
// .catch((error)=>console.log(error));


//Schema creating
// const registerSchema= new mongoose.Schema({
//     StudentMobileNO :{
//         type:String,
//         required:true,

//     },
//     StudentName:{
//         type:String,
//         required:true,

//     },
//     StudentEmail:{
//         type:String,
//         required:true,
//         unique:true,
//     },
//     StudentFatherName:{
//         type:String,
//         required:true,
//     }

// })
//cretae user model
// const register = mongoose.model('register', registerSchema);


//post api
// app.post('/api/register', async(req,res)=>{
//     try{
//         const{StudentMobileNO, StudentName,StudentEmail,StudentFatherName} = req.body;
//         //check for missing fields
//         if( !StudentMobileNO || !StudentName || !StudentEmail || !StudentFatherName){
// return res.status(400).json({message:'missing data require'})
//         }
//         const newregister= new register({
//           StudentMobileNO,
//           StudentName,
//           StudentEmail,
//           StudentFatherName,  
//         })
// //save the refister in database
// await newregister.save();
// res.status(200).json({message:"register Success",register:newregister})
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({message:"server error"})
//     }

// })


//edit api 
// app.put('/api/edit/:id', async(req,res)=>{
//     try{
//         const {id}= req.params;
//         const updatedata = req.body;
//         //find the user by id
// const updateUser =await register.findByIdAndUpdate(id,updatedata,
//   { new: true, runValidators:true}
// );

// if(!updateUser){
//     return res.status(404).json({message:'User not found'});
// }
// res.status(200).json({message:'User Update Susseccful',user:updateUser});
//     }
//     catch(error){
//         console.error("error");
//         res. status(500).json({message:'error during update'})

//     }
// })
// ✅ Payment Routes

app.use('*',function(req,res){
  res.sendFile(path.join,(__dirname,'./client/dist/index.html'))

})
app.use("/api/payment", paymentRoutes);
app.use('/api/auth', authRoute);
// category routes
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoute);

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});