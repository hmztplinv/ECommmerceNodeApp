const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
    _id: String,
    userId: String,
    productId: String,
    price: Number,
    quantity: Number,
});

const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;