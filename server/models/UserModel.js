const mongoose= require('mongoose')

const UserModel= new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please provide the name'],
        unique: true
    },
    email:{
        type: String,
        required: [true, 'Please provide the email'],
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    profilePic:{
        type: String,
        unique: true,
        default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
    }
},
{timestamps: true})

module.exports= mongoose.model('User', UserModel)