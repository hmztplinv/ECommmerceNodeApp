const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: String,
    userId: String,
    productId: String,
    price: Number,
    quantity: Number,
    createdDate: Date,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;