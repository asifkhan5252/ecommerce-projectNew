import express from "express";
import {  isadmin, verifytoken } from "./../middlewares/authMiddleware.js";
import {  createProductController, 
    deleteProductController,
     FilterProductController,
      getProductByCategoryController,
      getProductController,
       getSimilarProducts,
       getSingleProductController, 
       PaginationProductsController, 
       productCountController, 
       productPhotoController,
        searchProductController,
        updateProductController } from "./../controllers/productController.js";
import ExpressFormidable from "express-formidable";

const router = express.Router();

// Create category (only admin)
router.post("/create-product", verifytoken, isadmin, ExpressFormidable(), createProductController);

// get api
router.get("/get-product",getProductController );

// single product
router.get("/get-product/:slug",getSingleProductController);

// delete api
router.delete("/delete-product/:pid",verifytoken,isadmin,deleteProductController );

router.get("/photo-product/:pid",productPhotoController);

router.put("/update-product/:pid", verifytoken, isadmin, ExpressFormidable(), updateProductController);

// filter router
router.post("/filter-product",FilterProductController)

// count ka
router.get("/product-count", productCountController);

// 
router.get("/product-list/:page", PaginationProductsController);

// search hai route
router.get("/search/:keyword", searchProductController);


// Similar Products Route
router.get("/related-product/:pid/:cid", getSimilarProducts);

// routes/productRoutes.js
router.get("/product-category/:slug", getProductByCategoryController);


// router.get("/braintree/token", BraintreeTokenController);

// router.post("/braintree/payment", verifytoken, BraintreePaymentController);



export default router;
