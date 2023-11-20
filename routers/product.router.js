const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const upload = require('../services/file.services');
const response = require('../services/response.service');

router.post("/add", upload.array("images"), async (req, res) => {

    response(res, async () => {

        const { name, price, stock, categories } = req.body;
        const product = new Product({
            _id: uuidv4(),
            name: name.toUpperCase(),
            price: price,
            stock: stock,
            categories: categories,
            imageUrls: req.files,
            createdDate: new Date(),
            isActive: true
        });
        await product.save();
        res.json({ success: true, message: "Product added successfully", product });
    });
});

router.post("/removeById", async (req, res) => {
    response(res, async () => {
        const { _id } = req.body;
        const product = await Product.findById(_id);
        for(const image of product.imageUrls){
            fs.unlink(image.path, () => {});
        }
        await Product.findByIdAndDelete(_id);
        res.json({ success: true, message: "Product removed successfully", product });
    });

});

