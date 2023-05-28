import express from "express";
import colors from 'colors'
import dotenv from "dotenv";
import morgan  from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import cors from 'cors'
import AccountRouter from './controllers/accountController.js'
import path from 'path'
//rest object
const app = express();

//configure env
dotenv.config();

// database config
connectDB()

// static 
app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})
// middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/account",AccountRouter)

app.get('/',(req,res)=>{
    res.send({
        messege:"welcom"
    })
})

//Port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT,()=>{
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white)
})