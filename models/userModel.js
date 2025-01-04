const mongoose = require('mongoose')

const db_link = 'mongodb+srv://vansh74177:gEd2FhAGW0VwvuZV@cluster0.t9j29.mongodb.net/';
mongoose.connect(db_link)
.then((db)=>{
    // console.log(db)
    console.log('user db connected')
})
.catch( (err)=>{
    console.log(err)
    console.log('error connecting to db')
});
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        unique:true,
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    list:[
        {
            type:mongoose.Types.ObjectId,
            ref:"List"
        }
    ]
})
// model
const userModel = mongoose.model('userModel', userSchema)

module.exports=userModel;