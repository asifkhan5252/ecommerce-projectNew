import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";
import CategoryModel from "../models/categoryModel.js";
// import dotenv from "dotenv";

// import braintree from "braintree";
// import order from "../models/order.js";
// import { ok } from "assert";

// dotenv.config()
// // payment gatway
// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.BRAINTREE_MERCHANT_ID,
//   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });

// CREATE Product (aapne bana liya hai)
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ error: "All fields are required" });
    }

    if (photo && photo.size > 3000000) {
      return res.status(400).send({ error: "Photo size should be less than 3MB" });
    }

    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

// GET All Products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("category").select("-photo").sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message:'All products',
      total: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching products",
      error,
    });
  }
};

// GET Single Product by ID
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug }).select("-photo")  .populate("category", "name _id");;

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching product",
      error,
    });
  }
};

// GET Product Photo
export const productPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!pid || pid === "undefined") {
      return res.status(400).send({
        success: false,
        message: "Product ID is missing in request",
      });
    }

    const product = await productModel.findById(pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-type", product.photo.contentType);
      return res.send(product.photo.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting product photo",
      error,
    });
  }
};


// UPDATE Product
export const updateProductController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;

    if (photo && photo.size > 3000000) {
      return res.status(400).send({ error: "Photo size should be less than 3MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: name ? slugify(name) : undefined },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

// DELETE Product
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.pid).select("-photo");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error,
    });
  }
};


// filter produuct
export const FilterProductController= async(req,res)=>{
  try{
    const {checked,radio}=req.body;
    let argument={};
    if(checked.length > 0) argument.category=checked;
    if(radio.length >0)argument.price={$gte:radio[0],$lte:radio[1]}
    const products=await productModel.find(argument)
    res.status(200).send({success:true,products})

  }catch(error){
console.log(error)
  res.status(404).send({success:false,message:"error during filtering",error})
  }
}

// ✅ total products count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.estimatedDocumentCount(); // faster than countDocuments()
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};

// ✅ get all products with pagination
export const PaginationProductsController = async (req, res) => {
  try {
    const perPage = 6; // ek page par 6 products
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      page,
      perPage,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in get all products",
      error,
    });
  }
};
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params; // ✅ get keyword from URL

    const result = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },       // ✅ fixed $options
        { description: { $regex: keyword, $options: "i" } }, 
      ],
    }).select("-photo");

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in search all products",
      error,
    });
  }
};


// Similar Products Controller
export const getSimilarProducts = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    // find products from same category but exclude the current product
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(6) .populate("category"); // limit to 6 results

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting similar products",
      error,
    });
  }
};


export const getProductByCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category })
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching category products",
      error,
    });
  }
};



// Braintree payment gatway api
// token
// export const BraintreeTokenController = async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function (err, response) {
//       if (err) {
//         return res.status(500).send(err);
//       } else {
//         res.status(200).send({ clientToken: response.clientToken });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error });
//   }
// };




// payment
// ✅ Payment Controller
// export const BraintreePaymentController = async (req, res) => {
//   try {
//     const { nonce, cart } = req.body;

//     let total = 0;
//     cart.forEach((item) => {
//       total += item.price * (item.quantity || 1);
//     });

//     gateway.transaction.sale(
//       {
//         amount: total,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       async function (error, result) {
//         if (error) {
//           console.error("Braintree payment error:", error);
//           return res.status(500).send({ success: false, message: "Payment failed", error });
//         }

//         if (result.success) {
//           const newOrder = await new order({
//             products: cart,
//             payment: result,
//             buyer: req.user?._id || null,
//           }).save();

//           return res.status(200).send({
//             success: true,
//             message: "Payment successful",
//             order: newOrder,
//           });
//         } else {
//           res.status(500).send({ success: false, message: "Transaction failed", result });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Payment Controller Error:", error);
//     res.status(500).send({ success: false, message: "Server error", error });
//   }
// };
