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

const deleteUser= async(req, res, next)=>{
    //THIS IS HOW THE CODE LOOKED FOR JUST THE USER THEMSELVES ALONE DELETING IT. WE HAD TO TWEAK IT TO ALLOW FOR AN ADMIN TO DELETE AS WELL
    // if(req.user.id !== req.params.userId){  //the first user id is the one gotten from the cookie
    //     return next(errorHandler(403, 'You are not allowed to delete this user'))
    // }
    // try{
    //     await User.findByIdAndDelete(req.params.userId)
    //     res.status(200).json({msg: 'User deleted'})
    // }catch(error){
    //     next(error)
    // }

    if(!req.user.isAdmin && req.user.id !== req.params.userId){  
            return next(errorHandler(403, 'You are not allowed to delete this user'))
        }
        try{
            await User.findByIdAndDelete(req.params.userId)
            res.status(200).json({msg: 'User deleted'})
        }catch(error){
            next(error)
        }
}

const signout= (req, res, next)=>{  //notice this one is not async
    try{
        res.clearCookie('access_token').status(200).json('User has been signed out')
    }
    catch(error){
        next(error)
    }
}

const getUsers= async(req, res, next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to see all users'))
    }
    try{
        //just like in theposts, we'll have a startindex, limit and sort direction so we'll be able to apply the see more functionality
        const startIndex= parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const users= await User.find()
            .sort({createdAt: sortDirection})
            .skip(startIndex)
            .limit(limit);
//the above will give us the users but it'll show the pwd. WE wanna remove that
const usersNoPwd= users.map((user)=>{
    const {password, ...rest} = user._doc
    return rest
})
//we'd also need to get the total users
const totalUsers= await User.countDocuments()
const now= new Date()
const oneMonthAgo= new Date(
    now.getFullYear(),
    now.getMonth()- 1,
    now.getDate()
)

const lastMonthUsers= await User.countDocuments({
    createdAt: {$gte: oneMonthAgo},
})
res.status(200).json({
    users: usersNoPwd,
    totalUsers,
    lastMonthUsers
})

    }catch(error){
        next(error)
    }
}

const getCommentUser= async(req, res, next)=>{
    try{
        const user= await User.findById(req.params.userId)
        if (!user){
            return next(errorHandler(404, 'User not found'))
        }
        const {password, ...rest}= user._doc
        res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}

module.exports= {updateUser, check, deleteUser, signout, getUsers, getCommentUser}