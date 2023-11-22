const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./database/db');
const port=process.env.PORT || 5000;
const path=require("path");


app.use(express.json());
app.use(cors());
app.use("/uploads/images",express.static(path.join(__dirname,"uploads","images")));

const authRouter = require('./routers/auth.router');
const categoryRouter = require('./routers/category.router');
const productRouter = require('./routers/product.router');
const basketRouter = require('./routers/basket.router');

app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/baskets', basketRouter);

connection();

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});