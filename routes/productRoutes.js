import express from 'express';
import { isAdmin, requiredSignIn } from '../middlewares/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, categoryWiseController, createProductController, deleteProductController, getAllProductController, getSingleProductController, productCountController, productFilterController, productListController, productPhotoController, productRelatedController, productSearchController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router=express.Router();
//create product
router.post('/create-product',requiredSignIn,isAdmin,formidable(),createProductController);
//get all products
router.get('/getAllProducts',getAllProductController);
//get product on the basis of slug
router.get('/getSingleProduct/:slug',getSingleProductController);
router.get('/product-photo/:id',productPhotoController);
//delete product
router.delete('/delete-product/:id',requiredSignIn,isAdmin,deleteProductController);
//update product
router.put('/update-product/:id',requiredSignIn,isAdmin,formidable(),updateProductController);
//filter product
router.post('/filter-product',productFilterController);
//product count
router.get('/product-count',productCountController);
//product per page
router.get('/product-list/:page',productListController);
//search route
router.get('/search/:keyword',productSearchController);
//simmilar product
router.get('/similar/:pid/:cid', productRelatedController);
//categorywise
router.get('/product-category/:slug', categoryWiseController);
//paymentroutes
router.get('/braintree/token',braintreeTokenController);
//braintreepayment
router.post('/braintree/payment',requiredSignIn,braintreePaymentController);


export default router;
