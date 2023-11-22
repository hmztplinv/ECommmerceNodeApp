const express = require('express');
const router = express.Router();
const response = require('../services/response.service');
const Basket = require('../models/basket');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/product');

router.post("/add", async (req, res) => {
    response(res, async () => {
        const { userId, productId, price, quantity } = req.body;
        let basket = new Basket();
        basket._id = uuidv4();
        basket.userId = userId;
        basket.productId = productId;
        basket.price = price;
        basket.quantity = quantity;

        await basket.save();

        let product = await Product.findById(productId);
        product.stock -= quantity;
        await Product.findByIdAndUpdate(productId, product);
        res.json({ success: true, message: "Product added successfully", basket: basket });
    });
});

router.post("/removeById", async (req, res) => {
    response(res, async () => {
        const { _id } = req.body;
        let basket=await Basket.findById(_id);
        let product=await Product.findById(productId);
        product.stock=product.stock+basket.quantity;
        await Product.findbyIdAndUpdate(productId,product);
        await Basket.findByIdAndDelete(_id);
        res.json({ success: true, message: "Product removed successfully" });
    });
});

router.post("/", async (req, res) => {
    response(res, async () => {
        const { userId } = req.body;
        const baskets=await Basket.aggregate([
            {
                $match:{userId:userId}
            },
            {
                $lookup:{
                    from:"products",
                    localField:"productId",
                    foreignField:"_id",
                    as:"product"
                }
            }
        ]);

        res.json({ success: true, message: "Products listed successfully", baskets });
       
    });
});

router.post("/getBasketCount", async (req, res) => {
    response(res, async () => {
        const { userId } = req.body;
        const basketCount=await Basket.find({userId:userId}).count();
        res.json({ success: true, message: "Basket count listed successfully", basketCount: basketCount });       
    });
});

module.exports = router;