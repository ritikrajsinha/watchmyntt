import express from "express";
import {
  adminOrderController,
  forgotPasswordController,
  loginController,
  orderController,
  orderStatusController,
  profileController,
  registerController,
  testController,
} from "../controllers/registerController.js";
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post('/forgot-password',forgotPasswordController);
router.get("/test", requiredSignIn, isAdmin, testController);
router.get("/user-auth", requiredSignIn, (req, res) => {
  res.status(200).json({
    ok: "User is authenticated",
  });
});

router.get("/admin-auth", requiredSignIn,isAdmin, (req, res) => {
  res.status(200).json({
    ok: "Admin is authenticated",
  });
});
//profile
router.put("/profile",requiredSignIn,profileController);
router.get('/orders',requiredSignIn,orderController);
router.get('/allorders',requiredSignIn,isAdmin,adminOrderController);
router.put('/order-status/:orderid',requiredSignIn,isAdmin,orderStatusController);


export default router;
