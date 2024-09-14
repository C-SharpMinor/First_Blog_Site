const mongoose= require('mongoose')

const UserModel= new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide the name']
    },
    email:{
        type: String,
        required: [true, 'Please provide the email']
    },
    password:{
        type: String,
        required: true,
    }, 
},
{timestamps: true})

module.exports= mongoose.model('User', UserModel)