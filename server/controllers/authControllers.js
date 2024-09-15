const bcrypt= require('bcryptjs')
const User= require('../models/UserModel')
const {errorHandler}= require('../utils/ErrorHandlers')

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

module.exports= {signup, check, deleteUser}