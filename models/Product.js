const mongoose = require("mongoose")

const productsSchema = new mongoose.Schema({
    title : { type: String, required: true },
    descr : { type : String, required: true },
    img : { type: String, required : true},
    categories : { type : Array, required : true },
    price : { type : Number, required : true }
}, {timestamps : true})


module.exports = mongoose.model("product", productsSchema)