const express = require('express')
const mongoose=require('mongoose');
const authRoute=require("./routes/auth.js");
const dotenv= require('dotenv');
const cors=require("cors");
dotenv.config();



const Mongo_Url = process.env.MONGO_URL;
// console.log(Mongo_Url);
const connectToMongo=async ()=>{
    await mongoose.connect(Mongo_Url);
    console.log("Mongoose connected");
}

const app=express();
const port=5000;

connectToMongo();
app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/auth',authRoute)

app.listen(port,()=>{
console.log("backend is running")
})