import express from "express";
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController, deletecategoryController, getAllcategory, getSinglecategory, updatecategoryController } from "./../controllers/categoryController.js";

const router = express.Router();

router.post('/create-categogry',requiredSignIn,isAdmin,createCategoryController);
router.put('/update-category/:id',requiredSignIn,isAdmin,updatecategoryController);
router.get('/getallcategory',getAllcategory);
router.get('/getSingleCategory/:slug',getSinglecategory);
//delete
router.delete('/delete-category/:id',requiredSignIn,isAdmin,deletecategoryController);
export default router;
