const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const upload = require('../services/file.services');


router.post("/add",upload.array("images"), async (req, res) => {
    try {
        const { name, price, stock, categories } = req.body;
        const product = new Product({
            _id: uuidv4(),
            name:name.toUpperCase(),
            price:price,
            stock:stock,
            categories:categories,
            imageUrls:req.files,
            createdDate: new Date(),
            isActive: true
        });
        await product.save();
        res.json({ success: true, message: "Product added successfully", product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

});