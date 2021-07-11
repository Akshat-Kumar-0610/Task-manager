const express = require('express')
require('./db/mongoose')
const User=require('./models/User')
const Task=require('./models/Task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app=express()
const port = process.env.PORT || 3000
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('server is up and running on '+port )
})

// const main = async ()=>{
//     // const task = await Task.findById('60eac0bb7236a438a453d588')
//     // await task.populate('author').execPopulate()
//     // console.log(task.author)
//     const user = await User.findById('60eabfe098978a35d4d529f0')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()
