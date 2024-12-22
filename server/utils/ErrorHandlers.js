const errorHandler= (statusCode, message)=>{
    const err= new Error() //we are making up an error so we can call it in parts of the code that don't technically give errors but we don't wanna see stuff like that e.g. giving emoty string as password

    err.statusCode= statusCode
    err.message= message
    return err //since this err is what is being sent when an error occurs; when it gets to the frontend as 'data' after the fetch, the err is now data so we could now use the data.message
}

module.exports= {errorHandler}