const { errorHandler } = require("../utils/ErrorHandlers")
const bcrypt= require('bcryptjs')
const User= require('../models/UserModel')

const check= async(req, res)=>{
    res.json({msg: "I am functional"})
}

const updateUser= async(req, res, next)=>{
    if(req.user.id !== req.params.userId){ //it isn't ._id cuz we had changed the name to be saved as id in the google sign in controller func
        return next(errorHandler(403, 'You are not allowed to update this user'))
    }
    if(req.body.password)  {
        if(req.body.password.length < 5 ){
            return next(errorHandler(400, 'Password must be at least 5 characters'))
        }
        req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    if(req.body.username){
        if(req.body.username.length < 4 || req.body.username.length>20){
            return next(errorHandler(400, 'Username must be between 4 and 20 characters'))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username cannot contain a space'))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Username must be lowercase'))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'Username can only contain letters and numbers'))
        }
        try{
            const updatedUser= await User.findByIdAndUpdate(req.params.userId, { //notice it is.userId not .id cuz we named it userId at the route
                $set:{
                    username: req.body.username,
                    email: req.body.email,
                    profilePic: req.body.profilePic,
                    password: req.body.password
                }
            }, {new: true})
            const {password, ...rest}= updatedUser._doc
            res.status(200).json(rest)
        }catch(error){
            next(error)
        }
    }
}

module.exports= {updateUser, check}