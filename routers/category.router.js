const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { v4: uuidv4 } = require('uuid');

router.post("/add", async (req, res) => {
    try {
        const { name } = req.body;
        const checkCatName = await Category.findOne({ name: name });
        if (checkCatName != null) {
            res.status(403).json({ success: false, message: "Category already exists" });
        }
        else {
            const category = new Category({ _id: uuidv4(), name });
            await category.save();
            res.json({ success: true, message: "Category added successfully", category });
        }

    }

    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});


router.post("/removeById", async (req, res) => {
    try {
        const { _id } = req.body;
        const category = await Category.findByIdAndDelete(_id);
        res.json({ success: true, message: "Category removed successfully", category });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.post("/update", async (req, res) => {
    try {

        const { _id, name } = req.body;
        const category = await Category.findOne({ _id: _id });
        if(category.name != name){
            const checkName = await Category.findOne({name: name});
            if(checkName != null){
                res.status(403).json({message: "This category already exists!"});
            }else{
                category.name = name;
                await Category.findByIdAndUpdate(_id, category);
                res.json({message: "Category updated successfully"});
            }
        }
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json({ success: true, message: "Categories retrieved successfully", categories });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});


module.exports = router;