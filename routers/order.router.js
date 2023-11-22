const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/order');
const Basket = require('../models/basket');
const response = require('../services/response.service');


router.post("/create", async (req, res) => {
    const {userId}=req.body;
    let baskets=await Basket.find({userId:userId});

    for(const basket of baskets){
        let order=new Order();
        order._id=uuidv4();
        order.userId=userId;
        order.productId=basket.productId;
        order.price=basket.price;
        order.quantity=basket.quantity;
        order.createdDate=new Date();
        await order.save();
        await Basket.findOneAndDelete(basket._id);
    }
    res.json({success:true,message:"Order created successfully"});

});

router.post("/",async (req,res)=>{
    response(res,async ()=>{
        const {userId}=req.body;
        const orders=await Order.aggregate([
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
        ]).sort({createdDate:-1});

        res.json(orders);
       
    });
});

module.exports = router;