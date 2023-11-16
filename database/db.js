const mongoose = require('mongoose');
const uri="mongodb+srv://hmztpal:3330@ecommercedb.fnsbex6.mongodb.net/?retryWrites=true&w=majority"

const connection=()=>{
    mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{
        console.log("database connected")
    })
    .catch((err)=>{
        console.log(err.message)
    })
}

module.exports=connection;