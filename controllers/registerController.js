import User from "../models/userModel.js";
import orderModel from "../models/order.js";

import { comparepassword, hashPassword } from "../utils/authHelper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, question, role } = req.body;
    //validation
    if (!name || !email || !password || !phone) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    //existinguser
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(500).send({
        success: false,
        message: "This Email is already registered",
      });
    }
    //hashing password
    const hashedpassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedpassword,
      phone,
      address,
      question,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
        password: "",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    
      error: error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const isMatch = await comparepassword(password, user.password);
    if (!isMatch) {
      //redirect to link
      return res.status(403).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    //generate jwttoken
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    user.password = "";
    user.token = token;
    res.status(200).json({
      success: true,
      message: "Login Successfull",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
//arrow function for forgotpassword
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;
    if (!email || !question || !newPassword) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User Not Found",
      });
    }
    if (user.question !== question) {
      return res.status(403).json({
        success: false,
        message: "Security Question is incorrect",
      });
    }
    const hashed = await hashPassword(newPassword);
    //do it by findbyid and update
    await User.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    //catch error
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const testController = (req, res) => {
  return res.status(200).json({
    message: "test route",
  });
};
//profileController
export const profileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await User.findById(req.user.id);
    if (password && password.length < 6) {
      return res.status(403).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
   
    //update user
    const hashedpassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || user.name,
        email: email || user.email,
        password: hashedpassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      {
        new: true,
      }
    );
    //response success
    res.status(200).json({
      success: true,
      updatedUser,
      message:"Profile Updated Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
//ordercontroller
export const orderController = async (req, res) => {
  try {
    const Myorders = await orderModel
      .find({ buyer: req.user.id })
      .populate({
        path: 'products',
        select: '-photo',
        populate: {
          path: 'category', // This populates the 'category' field inside 'products'
           // Optional: specify fields to select, like 'name' or others you need
        },
      })
      .populate('buyer');

    res.status(200).json({
      success: true,
      Myorders,
      message: 'Orders Retrieved Successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
//adminOrderController
export const adminOrderController = async (req, res) => {
  try{

const Aorders = await orderModel
      .find({})
      .populate({
        path: 'products',
        select: '-photo',
        populate: {
          path: 'category', // This populates the 'category' field inside 'products'
           // Optional: specify fields to select, like 'name' or others you need
        },
      })
      .populate('buyer');

    res.status(200).json({
      success: true,
      Aorders,
      message: 'Orders Retrieved Successfully',
    });
  }catch(err){
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      });
  }
}
//orderStatusController
export const orderStatusController = async (req, res) => {
  try{
    const {orderid}=req.params;
    const {status}=req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(orderid, {status}, {new: true});
    res.status(200).json({
      success: true,
      updatedOrder,
      message: 'Order Status Updated Successfully',
      });
  }catch(err){
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      });

  }
}

