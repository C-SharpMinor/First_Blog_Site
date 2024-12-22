const mongoose= require('mongoose')

const PostModel= new mongoose.Schema({
    userId:{
        type: String, 
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type: String,
        default: "https://www.travelpayouts.com/blog/wp-content/uploads/2021/02/blog-images.png"
    },
    category:{
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
}, {timestamps: true}
)

module.exports= mongoose.model('Post', PostModel)