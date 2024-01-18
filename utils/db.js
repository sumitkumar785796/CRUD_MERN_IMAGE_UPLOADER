const mongoose = require('mongoose')
const URL = process.env.DB_URL || "mongodb://localhost:27017/EJSCRUD"
const connDB = async () =>{
    try {   
        await mongoose.connect(URL)
        console.log('successfull connected...')
    } catch (error) {
        console.log('Not connected...')
    }
}
module.exports=connDB