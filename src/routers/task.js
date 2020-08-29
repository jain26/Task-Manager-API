const express=require('express')
const Task=require('../db/models/task')
const router=express.Router()
const auth=require('../middleware/auth')

router.post('/tasks',auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        Owner : req.user._id
    })
    try {
        await task.save()
        res.status(400).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/tasks',auth, async (req, res) => {
    const match={}
    const sort={}

    if(req.query.Completed){
        match.Completed=req.query.Completed==='true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    try {
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id,Owner : req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['Description', 'Completed']
    const correctEntries = updates.every((data) => allowedUpdates.includes(data))
    if (!correctEntries) {
        return res.status(404).send('send correct data')
    }
    try {
        const task = await Task.findOne({_id : req.params.id,Owner : req.user._id})
        if (!task) {
            res.status(404).send()
        }
        updates.forEach((update)=> task[update]=req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/tasks/:id',auth,async(req,res)=>{
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id,Owner : req.user._id})
        if (!task) {
            res.status(404).send('no Task like this exist')
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router