const mongoose = require('mongoose')
const Task= require('./Task')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { findOne } = require('./Task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true
    },
    age:{
        type: Number,
        validate(value) {
            if(value<0){
                throw new Error('Age can not be a negative number')
            }
        }
    },
    email:{
        type:String,
        lowercasr:true,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
        validat(value){
            if(value.toLower.include('password')){
                throw new error('Password can not contain word \'Password\'')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'author'
})

userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Email or Password is wrong')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Email or Password is wrong')
    }
    return user
} 

userSchema.methods.toJSON = function(){
    const user = this 
    const userobject = user.toObject()
    delete userobject.password
    delete userobject.tokens
    return userobject
    
}

userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'taskmanager')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.pre('save',async function(next){
    const user = this 
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({author:user._id})
    next()
})

const User = mongoose.model('User',userSchema)

module.exports=User