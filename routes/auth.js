const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email : req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SECRET)
            .toString()
    })
    
    try {
        const savedUser = await newUser.save()
        const {password, ...resUser} = savedUser
        res.status(201).json(resUser._doc)
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(401).json("Пользователя с таким емейлом не существует")
        }

        const hashedPass = CryptoJS.AES.decrypt(
            user.password, 
            process.env.PASS_SECRET
            )
        const hashedPassword = hashedPass.toString(CryptoJS.enc.Utf8)
        
        if(hashedPassword !== req.body.password) {
            return res.status(401).json("Неправильный логин или пароль")
        } 
        const {password, ...resUser} = user._doc
       return res.status(200).json(resUser)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router