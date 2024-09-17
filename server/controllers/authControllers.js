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

const google= async(req, res, next) =>{
    const {name, email, googlePhotoUrl}= req.body //all info we are getting from the frontend google OAuth 
    try{
        const user = await User.findOne({email})
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            const {password, ...rest} = user.doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true, //makes it more secure
            }).json(rest)
        }
        //but if the email does not exist we'll have create a new user with the provided google email and since google only has the displayName and not the username, we'll set the username as the displayName provided so below we provide for if the username is not in the db
         else{
            const generatedPassword= Math.random().toString(36).slice(-8) //remember we are making an account using the information and we NEED a password to do that which the google info does not give us, so we are making a random pwd format
            //this pwd is a random combination of letters and numbers, toString(36) means the random creates random letters AND numbers combined, then the slice makes us choose the last 8 characters
            const hashedPassword= bcrypt.hash(generatedPassword, 10)
            const newUser= new User({
                username: name.toLowercase().split(' ').join('') + Math.random().toString(9).slice(-4), //9 means only random nubers are made
                //Oreoluwa Onabajo => oreoluwaonabajo5629
                email,
                password: hashedPassword,
                profilePic: googlePhotoUrl, //because of this we went to add a photo to the usermodel
            })
            await newUser.save()
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password, ...rest}= newUser._doc
            res.status(200)
            .cookie('access_token', token, {
                httpOnly: true, 
            }).json(rest)
         }
    }catch(error){
        next(error)
    }
}

module.exports= {signup, check, deleteUser, signin, google}