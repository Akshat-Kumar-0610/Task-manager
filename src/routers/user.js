const express = require('express')
const User = require('../models/User')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/users' ,async (req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token= await user.generateToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    
})

router.post('/users/login', async(req,res)=>{
    try{
        const user =await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken() 
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth, async(req,res)=>{
    try{
        //console.log(req.user.tokens)
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        //console.log(req.user)
        await req.user.save()
        res.send()
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.get('/users/me', auth ,async (req,res)=>{
    res.send(req.user)
})

router.get('/users/:id',async (req,res)=>{
    const _id= req.params.id
    try{
        const user = await User.findById(_id)
        //console.log(user)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

router.patch('/users/:id',async(req,res)=>{
    const updates =Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const validoperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if (!validoperation){
        return res.status(400).send({error: "invalid operation"})
    }
    try {
        const user =await User.findById(req.params.id)
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/:id',async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})


module.exports=router