const errorHandler= (statusCode, message)=>{
    const err= new Error() //we are making up an error so we can call it in parts of the code that don't technically give errors but we don't wanna see stuff like that e.g. giving emoty string as password

    err.statusCode= statusCode
    err.message= message
    return err
}

module.exports= {errorHandler}