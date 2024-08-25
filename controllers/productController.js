//import product from product model
import products from "../models/product.js";
import categoryy from "../models/category.js";
import orderModel from"../models/order.js"
import slugify from "slugify";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";


dotenv.config();

//gateway module braintree
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//createproductconroller
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //check if all fields are filled
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //create product
    const product = new products({
      ...req.fields,
      slug: slugify(name),
    });
    //save photo
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).json({
      message: "Product created successfully",
      products: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
//get product controller
export const getAllProductController = async (req, res) => {
  try {
    const Allproducts = await products
      .find({})
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 })
      .populate("category")
      .exec();
    res.status(200).json({
      success: true,

      message: "All products fetched successfully",
      Allproducts: Allproducts,
    });
  } catch (error) {
    //catch error
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
//get single product on thebasis of slug
export const getSingleProductController = async (req, res) => {
  try {
    const product = await products
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category")
      .exec();
    res.status(200).json({
      success: true,
      message: "Single product fetched successfully",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await products
      .findById(req.params.id)
      .select("photo")
      .exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
//delete product
export const deleteProductController = async (req, res) => {
  try {
    //delete the product on the basis of id
    const product = await products.findByIdAndDelete(req.params.id).exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    //send success response
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
//updateproduct on the basis of id
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //check if all fields are filled
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }
    //check if the name is unique

    //check if the slug is unique

    //
    const product = await products.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, sulg: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
//productfiltercontroller
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};

    if (checked.length) {
      args.category = checked; // Use $in to match any of the checked categories
    }
    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const fproducts = await products.find(args);

    res.status(200).json({
      success: true,
      fproducts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Error while processing filters",
    });
  }
};
//productCountController
export const productCountController = async (req, res) => {
  try {
    const total = await products.find({}).estimatedDocumentCount();
    res.status(200).json({
      success: true,
      total,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
//productListController
export const productListController = async (req, res) => {
  try {
    const perpage = 3;
    const page = req.params.page ? req.params.page : 1;
    const sproduct = await products
      .find({})
      .select("-photo")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort({
        createdAt: -1,
      });
    //success status
    res.status(200).json({
      success: true,
      sproduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
//productSearchConroller
export const productSearchController = async (req, res) => {
  try {
    //keyword basis
    const keyword = req.params.keyword;
    //create a result and search on the basis of keyword name and description
    const result = await products
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    //response
    res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
//productRelatedController
// Import necessary modules
// Assuming you need this for other operations

// Controller function for getting related products
export const productRelatedController = async (req, res) => {
  try {
    // Extract PID and CID from request parameters
    const { pid, cid } = req.params;

    // Fetch related products based on the category ID and excluding the current product ID
    const rProducts = await products
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo") // Exclude photo field for performance
      .limit(2) // Limit to 2 related products
      .populate("category"); // Populate category for better detail

    // Check if related products are found

    // Return the found related products
    res.status(200).json({
      success: true,
      rProducts, // Correct field to use here
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
//categoryWiseConroller
export const categoryWiseController = async (req, res) => {
  try {
    // Find one category by slug
    const categori = await categoryy.findOne({ slug: req.params.slug });

    if (!categori) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Find products associated with the found category
    const product = await products
      .find({ category: categori._id })
      .select("-photo")
      .populate("category");

    res.status(200).json({
      success: true,
      product,
      categori,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
//braintreeTokenController
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        console.error(err);
        res.status(500).json({
          success: false,
          error: err.message,
        });
      } else {
        res.status(200).json({
          success: true,
          clientToken: response.clientToken,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

//braintreePaymentController
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user.id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
