const jwt=require('jsonwebtoken')
const User=require('../db/models/user')

const auth=async(req,res,next)=>{
    try{
        const token=await req.header('Authorization').replace('Bearer ','')
        const decoded=await jwt.verify(token,process.env.JWT_SECRET_ENV)
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token=token
        req.user=user
        next()

    }catch(e){
        res.status(401).send('Please authenticate')
    }
}

module.exports=auth