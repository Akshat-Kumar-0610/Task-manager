const express = require('express')
const User = require('../models/User')
const router = new express.Router()
const multer = require('multer')
const auth = require('../middleware/auth')
const sharp=require('sharp')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')


router.post('/users' ,async (req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
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

router.post('/logout',auth, async(req,res)=>{
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

router.post('/logoutall',auth, async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({'success':'logged out successfully'})
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth ,async (req,res)=>{
    res.send(req.user)
})

router.patch('/users/me',auth, async(req,res)=>{
    const updates =Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const validoperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if (!validoperation){
        return res.status(400).send({error: "invalid operation"})
    }
    try {
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async(req,res)=>{
    try{
        await req.user.remove()
        sendCancelEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|bmp|png)$/)){
            return callback(new Error('Please upload an image file'))
        }
        callback(undefined, true)
    }
})

router.post('/users/me/avatar',auth, upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:400,height:400}).png().toBuffer()
    req.user.avatar= buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/deleteAvatar',auth,async (req,res)=>{
    req.user.avatar= undefined
    await req.user.save()
    res.send()
})

router.get('/users/me/avatar',auth,async (req,res)=>{
    try{
        if(!req.user.avatar){
            throw new Error()
        }

        res.set('Content-type','image/png')
        res.send(req.user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports=router