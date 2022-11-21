const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const productsRoute = require("./routes/products")
const multer = require("multer")
const path = require('path')
const authRoute = require("./routes/auth")
const cors = require("cors")
const stripe = require('stripe')('pk_test_51LY447HWg33SQmOYkw5NDamYDIC6nmq6E8TuAzs8BFgElOjFEhM8GjZxjoIguoAhF07s5XgS346RXTd4Fx4xz9rX00cYDOothX')

dotenv.config()

mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then(() => console.log("connected"))
    .catch(err => console.log(err))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const uploadImage = multer({storage : storage})
app.post("/api/upload", uploadImage.single("file"), (req, res) => {
    res.status(200).json("file uploaded")
})

app.use(cors())
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use("/api", productsRoute)
app.use("/api", authRoute)

app.post('/api/pay', async (req, res) => {
    const { price, id } = req.body
    try {
        const payment = await stripe.paymentIntents.create({
            amount: price,
            currency: 'USD',
            payment_method : id
        });
        res.json("success")
    } catch (err) {
        console.log(err)
    }
})

app.listen(process.env.PORT || 5000, () => {
    console.log("OK");
})