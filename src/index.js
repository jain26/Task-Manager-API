const express = require('express')
require('./db/mongoose')
const userRouter=require('../src/routers/user')
const taskRouter=require('../src/routers/task')

const app = express()
const port = process.env.Port || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('The app listening at port ' + port)
})