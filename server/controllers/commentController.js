const Comment= require('../models/CommentModel')
const { errorHandler } = require('../utils/ErrorHandlers')

const CreateComment= async(req, res, next)=>{
    try{
        const {content, postId, userId}= req.body
        if(userId !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to create this comment'))

        }
        const newComment= new Comment({
            content, postId, userId
        })
        await newComment.save()
        res.status(200).json(newComment)
    }catch(error){
        next(error)
    }
}

const getPostedComments= async(req, res, next)=>{
    try{
        const comments= await Comment.find({postId: req.params.postId})
        .sort({createdAt: -1            
        })
        res.status(200).json(comments)// without this response, the 
    }catch(error){
        next(error)
    }
}

const likesComment= async(req, res, next)=>{
    try{
        const comment= await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorhandler(404, 'Comment not found'))
        }
        const userIndex = comment.likes.indexOf(req.user.id)
        if(userIndex === -1){
            comment.numberOfLikes += 1; //from the model
            comment.likes.push(req.user.id)
        }
        else{
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1)
        }
        await comment.save()
        res.status(200).json(comment)
    }catch(error){
        next(error)
    }
}

const editComment= async(req, res, next)=>{
    try{
        const comment= await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(404, 'Comment not found'))
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(403, 'You are not alowed to edit this comment'))
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.bosy.content,
            },
            {new: true}//this means when giving the value that will be assigned to the variable, send the new value not the old
        )

        res.status(200).json(editedComment)
    }catch(error){
        next(error)
    }
}

const deleteComment= async(req, res, next)=>{
    try{
        const comment= await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(404, 'Comment not found'))
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(403, 'You are not alowed to delete this comment'))
        }
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json('Comment has been deleted')
    }catch(error){
        next(error)
    }
}

const getComments= async(req, res, next)=>{
    if(!req.user.isAdmin){ //for us to be able to use this .isAdmin, we had to pass the verifyToken function in the route fle. WHY?
        return next(errorHandler(403, 'You are not allowed to get all comments'))
    }
    try{
        const startIndex= parseInt(req.query.startIndex) || 0
        const limit= parseInt(req.query.limit) || 9
        const sortDirection= req.query.sort === 'desc' ? -1 : 1
        const allComments= await Comment.find()
        .sort({createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit)
        const totalComments= await Comment.countDocuments()
        const now= new Date()
        const oneMonthAgo= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        const lastMonthComments= await Comment.countDocuments({createdAt: {$gte: oneMonthAgo}})
        res.status(200).json({allComments, totalComments, lastMonthComments})
    }catch(error){
        next(error)
    }
}
module.exports= {CreateComment, getPostedComments, likesComment, editComment, deleteComment, getComments}