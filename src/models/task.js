const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required : true,
    },
    description:{
        type:String,
        required:true,
        trim : true
    },
    completed:{
        type:Boolean,
        default: false
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User',
    }
},{
    timestamps:true
})
const Task = mongoose.model('Task',taskSchema)

module.exports=Task