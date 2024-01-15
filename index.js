
import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import User from "./models/userScema.js"
const db = "mongodb+srv://seif:seif123@cluster0.g9keomu.mongodb.net/"
const app = express()



app.use(express.json())

mongoose.connect(db).then(()=>{
    app.listen(3000,()=>{

        console.log("db and server already connected");
    })
})
app.get("/",(req,res)=>{
    res.json("wow")
})
app.post("/user", async(req,res)=>{
    try{
    const {name,password}=req.body
    console.log(req.body);
    const hashPassword = await bcrypt.hash(password,10)
    const newUser = new User({name,password:hashPassword})
    await newUser.save()
    res.status(201).json("sucsess")
    }catch(err){
res.status(402).json("faild")
    }

})

app.post("/signin", async(req,res)=>{
    
    const {name,password}=req.body
    const findUser = await User.find({name})
    const comparePassword = await bcrypt.compare(password,findUser.password)
    if(!findUser){
        return res.status(404).json("user not found")
    }
    // if(!findUser){
    //     return res.status(404).json("user not found")
    // }
    console.log(comparePassword);
    res.json(req.body)
})
