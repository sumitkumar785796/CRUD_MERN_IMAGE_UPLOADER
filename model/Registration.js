const mongoose = require('mongoose')
const RegistrationSchema = new mongoose.Schema({
    profile:{
        type:String,
        required:true
    },
    fname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    }
})
//define collection name
const RegForm = new mongoose.model('RegForm',RegistrationSchema)
module.exports=RegForm