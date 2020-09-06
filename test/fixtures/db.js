const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const User=require('../../src/db/models/user')

const userOneID=new mongoose.Types.ObjectId()
const userOne={
    _id:userOneID,
    name:"Saurabh",
    email:"sjjuuiui@gmail.com",
    password:"12345fhud7",
    tokens:[{
        token:jwt.sign({_id:userOneID},process.env.JWT_SECRET_ENV)
    }]
}

const preData=async()=>{
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports={
    userOne,
    userOneID,
    preData
}
