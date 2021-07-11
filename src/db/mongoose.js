const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify:false
})
