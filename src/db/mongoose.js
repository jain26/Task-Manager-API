const mongoose= require('mongoose')
mongoose.connect(process.env.MONGODB_PATH_ENV,{
    useNewUrlParser: true,
    useCreateIndex: true
})



