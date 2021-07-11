const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req,res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        //console.log(decoded._id)
        //const user = await User.findById(decoded._id)
        const user = await User.findOne({ _id:decoded._id,'tokens.token':token})
        //console.log(user)
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user=user
        next()
    
    }catch(e){
        res.status(401).send({'error':'please authenticate'})
    }
}
module.exports= auth