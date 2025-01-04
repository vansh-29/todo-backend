const mongoose = require("mongoose")

const conn = async (req,res)=>{
    try{
        await mongoose.connect("mongodb+srv://vansh74177:gEd2FhAGW0VwvuZV@cluster0.t9j29.mongodb.net/").then( ()=>{
            console.log("mongo db connected")
        } )
    }
    catch(err){
        console.log("error in db")
        console.log(err.error)
    }
};
conn();