const jwt=require('jsonwebtoken');
const userModel=require('../models/user');
const bcyrpt=require('bcryptjs');
require("dotenv").config()

const register=async(req,res)=>{
    const {name,email,password,role="user"}=req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"all fields are required"})
    }
    const isUserExist=await userModel.findOne({$or:[{name},{email}]});
    if(isUserExist){
        return res.status(400).json({message:"User is already exist"});
    }
    const hash=await bcyrpt.hash(password,10);
    try{
        const user= await userModel.create({
            name,
            email,
            password:hash ,
            role
        });
        const token=jwt.sign({
            id:user._id,
            role:user.role
        },
        process.env.JWT_SECRET
         );
        res.cookie("token",token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax'
        });
        return res.status(201).json({message:"User is created Successfully",user:{
             id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            role:user.role
        }})

    }catch(err){
        console.log(err.message)
        return res.status(401).json({message:"error in creating User" ,err});
    }

}

const login=async(req,res)=>{
    const {email ,password}=req.body;
    try{
       const user= await userModel.findOne({email});
       if(!user){
        return res.status(400).json({message:"Invalid Email"});
       }
       const isMatch=await bcyrpt.compare(password,user.password);
       if(!isMatch){
        return res.status(400).json({message:"Invalid Password"})
       }
        const token=jwt.sign({
            id:user._id,
            role:user.role
        },
        process.env.JWT_SECRET
         );
      res.cookie("token",token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax'
      });
    return res.status(201).json({message:"You login Successfully Successfully",user:{
             id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token
        }});

    }
       catch(err){
         return res.status(401).json({message:"there is some error " ,err})
       }    

    }

const logout=async(req,res)=>{
    res.clearCookie("token");
    res.status(200).send({message:"You are logged out"});
}


module.exports={register ,login,logout  };
 