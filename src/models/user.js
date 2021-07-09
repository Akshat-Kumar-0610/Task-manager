const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',{
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
    }
})

module.exports=User