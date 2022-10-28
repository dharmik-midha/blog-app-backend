const jwt=require('jsonwebtoken');
const  SECRET  = require('../secret');
module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        jwt.verify(token,SECRET);
        next();
    }
    catch(err){
        console.log(err);
       res.status(401).json({msg:err});
    }
}