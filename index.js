const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const productsRoute = require("./routes/products")
const multer = require("multer")

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

app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use("/api", productsRoute)

app.listen(5000, () => {
    console.log("OK");
})