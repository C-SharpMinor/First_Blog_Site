const express= require('express')
require('dotenv').config()
const mongoose= require('mongoose')
const UserRoutes= require('./routes/UserRoutes')
const AuthRoutes= require('./routes/authRoute')
const cors =require('cors')


const PORT = process.env.PORT || 3000
const app= express()
app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json())
app.use('/api/user', UserRoutes)
app.use('/api/auth', AuthRoutes)

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500
    const message= err.message || 'Internal server error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.get('/', (req, res)=>{
    res.send('Welcome to the server')
})

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Database connected')
})
.catch((err)=>{
    console.log(err)
})
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})