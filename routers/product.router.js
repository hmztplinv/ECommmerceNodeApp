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

router.post("/",async (req,res)=>{
    response(res,async ()=>{
        const {pageNumber,pageSize,searchText}=req.body;
        let productCount=await Product.find({
            $or:[
                {name:{$regex:searchText,$options:"i"}}
            ]

        }).count();

        let products=await Product.find({
            $or:[
                {name:{$regex:searchText,$options:"i"}}
            ]
        })
        .sort({name:1})
        .populate("categories")
        .skip((pageNumber-1)*pageSize)
        .limit(pageSize);

        let totalPageCount=Math.ceil(productCount/pageSize);
        let model={
            datas:products,
            pageNumber:pageNumber,
            pageSize:pageSize,
            totalPageCount:totalPageCount,
            isFirstPage:pageNumber==1 ? true:false,
            isLastPage:totalPageCount==pageNumber ? true:false
        };
        res.json(model);
    });
});

router.post("/getById",async (req,res)=>{
    response(res,async ()=>{
        const {_id}=req.body;
        let product=await Product.findById(_id).populate("categories");
        res.json(product);
    });
})

router.post("/update",upload.array("images"),async (req,res)=>{
    response(res,async ()=>{
        const {_id,name,price,stock,categories}=req.body;
        let product=await Product.findById(_id);
        for(const image of product.imageUrls){
            fs.unlink(image.path,()=>{});
        }
        let imageUrls;
        imageUrls=[...product.imageUrls,...req.files];
        product={
            name:name.toUpperCase(),
            price:price,
            stock:stock,
            categories:categories,
            imageUrls:imageUrls
        };
        await Product.findByIdAndUpdate(_id,product);
        res.json({success:true,message:"Product updated successfully",product
        });
    });
});

router.post("/removeImageById",async (req,res)=>{
    response(res,async ()=>{
        const {_id,index}=req.body;
        let product=await Product.findById(_id);
        if(product.imageUrls.length==1){
            return res.json({success:false,message:"You can not remove all images"});
        }else{
            let image=product.imageUrls[index];
            product.imageUrls.splice(index,1);
            await Product.findByIdAndUpdate(_id,product);
            fs.unlink(image.path,()=>{});
            res.json({success:true,message:"Image removed successfully"});
        }

    });
})