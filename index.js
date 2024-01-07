const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const productsRoute = require("./routes/products")
const multer = require("multer")
const path = require('path')
const authRoute = require("./routes/auth")
const cors = require("cors")
const stripe = require('stripe')('sk_test_51LY447HWg33SQmOYNs0iePfJf1zBqa4AM9JFThAVbM5i5Nf6Ph2EYWIUANQpaMpozs9mb4Rnk9WjAo2l7B4Cn9Ca00MBfQmxNQ')

dotenv.config()

mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then(() => console.log("connected"))
    .catch(err => console.log(err))

app.use(cors())
app.use(express.json())
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
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use("/", productsRoute)
app.use("/api", authRoute)

// app.post('/api/pay', async (req, res) => {
//     const { price, id } = req.body
//     try {
//         const payment = await stripe.paymentIntents.create({
//             amount: price,
//             currency: 'USD',
//             payment_method : id
//         });
//         res.json("success")
//     } catch (err) {
//         console.log(err)
//     }
// })

app.post("/api/create-payment-intent", async (req, res) => {
    
    const { total } = req.body;
    // Create a PaymentIntent with the order amount and currency
    if(total === 0) {
        return res.status(401).json("Ваша сумма 0")
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "usd"
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("OK");
})