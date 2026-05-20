const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');

/** 
* - user register controller
* - Post /api/auth/register
*/


async function userRegisterController(req, res){
    const {email, password, name} = req.body;
    
    const isExists = await userModel.findOne({email});
    
    if(isExists){
        return res.status(422).json({
            message: "User already exists with this email.",
            status: "failed"
        })
    }
    
    const user = await userModel.create({
        email,
        password,
        name
    })
    
    // return res.status(201).json({
        //     message: "User registered successfully.",
        //     status: "success",
        //     user
        // })
        
        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"})
        // return res.status(201).json({
            //     message: "User registered successfully.",
            //     status: "success",
            //     user,
            //     token
            // })
            
            res.cookie("token", token)
            res.status(201).json({
                user:{
                    _id: user._id,
                    email: user.email,
                    name: user.name
                },
                token
            })
            
}
        
/** 
* - user login controller
* - Post /api/auth/login
*/

async function userLoginController(req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({
            message: "Invalid email or password."
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            message: "Invalid email or password."
        })
    }

    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"})

    res.cookie("token", token)
    res.status(200).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
}
        
        
        
module.exports = {
    userRegisterController,
    userLoginController
}