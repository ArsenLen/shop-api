const router = require("express").Router()
const Product = require("../models/Product")

router.post("/products", async (req, res) => {
    const newProduct = new Product(req.body) 
    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)  
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/products", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    let products
    try {
        if(qCategory) {
            products = await Product.find({
                categories : {
                    $in : [qCategory]
                }
            })
        } else {
            products = await Product.find()
        }
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.delete("/product/:id", async (req, res) =>{
    try {
        await Product.findByIdAndDelete(req.body.id)
        res.status(200).json("Успешно удален")
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router