const bcrypt= require('bcryptjs')
const User= require('../models/UserModel')
const {errorHandler}= require('../utils/ErrorHandlers')
const jwt = require('jsonwebtoken')
const check= async(req, res)=>{
    const AllUsers= await User.find()
    res.json({AllUsers})
}
const deleteUser= async(req, res)=>{
    const {username}= req.body
    const deleted= await User.findOneAndDelete({username})
    if(deleted){
        return res.status(200).json({msg: 'User deleted'})
    }
    else{
        return res.status(400).json({msg: 'User not found'})
    }
}

const signup= async(req, res, next)=>{
    const {username, email, password}= req.body
    const hashedPassword= await bcrypt.hash(password, 10)

    if(!username || !email || !password || username===" " || email===" " || password===" "){
        next(errorHandler(400, "All fields are required"))//this was the error we made, basically , the next() houses the error that is thrown
        }

    try{
        const newUser= new User({
            username,
            email,
            password: hashedPassword 
        })
        await newUser.save()
        return res.status(201).json({msg: 'Signup successful'})
        }
        catch(error){
            next(error)//this error catches if there is an existing username or email, it was defined in the server.js
        }
    
    }

const signin = async(req, res, next)=>{
    const {email, password}= req.body
    if(!email || !password || email===" " || password===" "){
        next(errorHandler(400, 'All fields are required'))
    }
    try{
        const validUser= await User.findOne({email})
        if (!validUser){
            return next(errorHandler(400, 'Invalid credentials, User')) 
        }
        const validPwd= await bcrypt.compare(password, validUser.password)
        if(!validPwd){
            return next(errorHandler(400, 'Invalid credentials pwd')) //when programming a sign in and the user gives the wrong pwd or email it is better for the user to not know which one was incorrect because if it's a hacker they can begin to try other different pwds when it shows pwd incorrect
        }
        const token= jwt.sign(
            {id: validUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'}
        )
        const {password:pass, ...rest}= validUser._doc  //removing the password
            res.status(200).cookie('accesstoken', token, {httpOnly: true}).json(rest)
                
    }    
    catch(error){
        next(error)
    }
    
}


module.exports= {signup, check, deleteUser, signin}