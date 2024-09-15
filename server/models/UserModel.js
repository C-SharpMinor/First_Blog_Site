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
},
{timestamps: true})

module.exports= mongoose.model('User', UserModel)