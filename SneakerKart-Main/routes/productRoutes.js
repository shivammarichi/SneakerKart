import express from "express";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, realtedProductController, searchProductController, updateProductController,createOrderController,createGuestOrderController } from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

// Create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// Update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Get products
router.get("/get-product", getProductController);

// Single product
router.get("/get-product/:slug", getSingleProductController);

// Get photo
router.get("/product-photo/:pid", productPhotoController);

// Delete product
router.delete("/delete-product/:pid", deleteProductController);

// Filter product
router.post("/product-filters", productFiltersController);

// Product count
router.get("/product-count", productCountController);

// Product per page
router.get("/product-list/:page", productListController);

// Search product
router.get("/search/:keyword", searchProductController);

// Similar product
router.get("/related-product/:pid/:cid", realtedProductController);

// Category wise product
router.get("/product-category/:slug", productCategoryController);

// New route for creating orders
router.post("/create-order", createOrderController); // Adjust middleware as needed
// Endpoint for guest orders
router.post("/create-guest-order", createGuestOrderController);

export default router;
