const express= require('express')
require('dotenv').config()
const mongoose= require('mongoose')
const PORT = process.env.PORT || 3000

const app= express()
app.use(express.json())
app.get('/', (req, res)=>{
    res.send('Welcome to the server')
})

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Database connected')
})
app.listen(PORT, ()=>{
    console.log('server is running on port 3000')
})