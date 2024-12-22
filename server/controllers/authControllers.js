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
            {id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET, {expiresIn: '4h'}
        )
        const {password:pass, ...rest}= validUser._doc  //removing the password
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
                //format of .cookie(name of cookie, token from jwt(so you gain access to the page), httpOnly(security measure ensuring that the cookie can be accessed by the server and not the JS on the browser))
                
    }    
    catch(error){
        next(error)
    }
    
}

const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePic: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
};

module.exports= {signup, check, deleteUser, signin, google}