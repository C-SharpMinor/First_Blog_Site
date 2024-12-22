const Post = require('../models/PostModel')
const {errorHandler}= require('../utils/ErrorHandlers')

const Create= async(req, res, next)=>{
    console.log(req.body)
    if (!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create a post'))
        }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Please provide all required fields'))
    }

    const slug= req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
    const newPost= new Post({
        ...req.body, slug, userId: req.user.id
    })
    //to use this, we had to first go create the Post model
    try{
        const savedPost= await newPost.save();
        res.status(201).json(savedPost)
    }
    catch(error){
        next(error)
    }
    }
    //after making this controller, we went to postman to create a post there first. But when we went through the command, it gave the unauthorized error
    // So we had to sign in to your admin account, recall we had made an admin accountin mongo directly before. So that the signed in account can have the token to make the post

const getPosts= async(req, res, next)=>{
    try{
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9  //this is cuz we don't wanna show all the posts at once on the page
        const sortDirection= req.query.prder === 'asc' ? 1 : -1 //this sets this the numbering order of the posts. if it's ascending, it's 1, if it's descending, it's -1
        const posts= await Post.find({ //this below is all cuz we might want to find some users based on different queries
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && { _id: req.query.postId}),//notice that here, we did not use postId for the object that is being passed in the query, we used _id because in the db, postId is '_id
            ...(req.query.searchTerm && {
                $or: [ //or enables us to be able to search based on different queries at a time. here we are searching based on both the title and content
                {title: { $regex: req.query.searchTerm, $options: 'i'}},  //options 'i' means the search ins't search senstive 
                {content: { $regex: req.query.searchTerm, $options: 'i'}},
                ]
            })
    }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit)

    const totalPosts= await Post.countDocuments()

    const now= new Date()
    const oneMonthAgo= new Date(
        now.getFullYear(),
        now.getMonth() - 1, 
        now.getDate()
    )

    const lastMonthPosts= await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo}
    })

    res.status(200).json({posts, totalPosts, lastMonthPosts})

    }
    catch(error){
        next(error)
    }
}

const deletePost= async(req, res, next)=>{
    if(!req.user.isAdmin || req.user.id !== req.params.userId){// why is it user.id here and not user._id
        return next(errorHandler(403, 'You are not allowed to delete this post'))
    }
    try{
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({msg: 'Post deleted'})
    }
    catch(error){
        next(error)
    }
}

const updatePost= async(req, res, next)=>{
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to update this post'))
    }
    try{
        const updatePost= await Post.findByIdAndUpdate(req.params.postId, {
            $set: { //normally this is just '$set: req.body' but we are not oing that here to protect it incase the user wants to change the userID. I don't get what that means or what this $set is for
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image
            }}, {new: true}
        )
        res.status(200).json(updatePost)
        //now it's to connect this to the frontend
    }catch(error){
        next(error)
    }
}

module.exports= {Create, getPosts, deletePost, updatePost}