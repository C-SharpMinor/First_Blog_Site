const jwt= require('jsonwebtoken')
const {errorHandler}= require('./ErrorHandlers')


//the purpose of this middleware is for where we need to ensure it's stll the user that's logged in eg to see the user profile
const verifyToken = (req, res, next) =>{
    console.log(req.cookies)
    const token = req.cookies.access_token; //cookies areautomatically attched to a user and sent by the browser for every subsequent request ONCE THE USER SIGNS IN and the cookie is generated
    if (!token){
        return next(errorHandler(401, 'Unauthorized'))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
        if(err){  //e.g if the token is invalid
            return next(errorHandler(401, 'Unauthorized'))
        }
        //so without an error, we want the request to now have the user info so it can now go into the usercontroller
        req.user = user
        console.log(req.user)
        next()
    })
}

module.exports= {verifyToken}