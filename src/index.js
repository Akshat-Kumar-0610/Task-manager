const express = require('express')
require('./db/mongoose')
const User=require('./models/User')
const Task=require('./models/Task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app=express()
const port = process.env.PORT 
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('server is up and running on '+port )
})
