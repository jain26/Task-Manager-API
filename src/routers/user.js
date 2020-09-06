const express=require('express')
const User=require('../db/models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const router=express.Router()
const SMail=require('../emails/accounts')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        SMail.sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})
router.post('/user/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!=req.token
        })
        await req.user.save()
        res.send('Succesfully logout')
    }catch(e){
        res.status(500).send()
    }
    
})
router.post('/user/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send('All sessions logout successfully')
    }catch(e){
        res.status(500).send()
    }
})
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    
})
router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const correctEntries = updates.every((data) => allowedUpdates.includes(data))
    if (!correctEntries) {
        return res.status(400).send('send correct data')
    }
    try {
        updates.forEach((update)=> req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/users/me',auth, async (req, res) => {
    try {
        req.user.remove()
        SMail.sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
    
})

const upload=multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('upload an image'))
        }

        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width : 250,height : 250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error : error.message})
})
router.delete('/users/me/avatar',auth,async(req,res) => {
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports=router