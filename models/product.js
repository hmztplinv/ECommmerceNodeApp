const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: String,
    name: String,
    price: Number,
    stock: Number,
    imageUrls:Array,
    createdDate:Date,
    isActive:Boolean,
    categories:[{type:String,ref:'Category'}]
});

module.exports = mongoose.model('Product', productSchema);
