const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
let JWT_KEY = 'qriv37fj48fk294J'
module.exports.signUser = async function signUser(req,res){
    try{
      const {name,email,password} = req.body
      if(!name || !email || !password){
        return res.status(404).json({
            message:"enter all details",
            success: false
        })
      }
      const alread = await userModel.findOne({email:email})
      if(!alread){
        const hashedPassword = await  bcrypt.hash(password,10);
        const user = await userModel.create({
          name:name,
          password :hashedPassword,
          email : email
        }) 
        if(user){
          return res.json({
              message:"user created successfully",
              data:user,
              success : true
          })
        }
        else{
          return res.json({
              message:"error in creating user"
          })
        }
      }
      else{
        return res.json({
          message:"user exists",
          user:alread
        })
      }
      
    }
    catch(err){
        return res.json({
            message:"error in creating user"
        })
    }
}

module.exports.getUser = async function getUser(req,res){
  try{
    let id = req.params.id
    let user = await userModel.findById(id)
    
    if(user){
      return res.json({
          message:"user found successfully",
          data:user,
          success : true
      })
    }
    else{
      return res.json({
          message:"error in getting user"
      })
    }
  }
  catch(err){
      return res.json({
          message:"error in getting user",
          error: err.message
      })
  }
}

module.exports.loginUser = async function loginUser(req,res){
  try{
    const {email,password} = req.body
    console.log(req.body)
    console.log(email, password)
    let user = await userModel.findOne({email:email})
    console.log(user)
    if(user){
      const isPassCorrect = bcrypt.compare(req.body.password,user.password , function(err,result){
        if(err){
          return res.json({
            message:err.message
          })
        }
        if(result){
          let uid = user['_id'] //uid
          let token = jwt.sign({payload:uid} , JWT_KEY)
          res.cookie('login', token, { sameSite: 'None' , maxAge: 24 * 60 * 60 * 1000});
          // localStorage.setItem('userId', uid); // Storing user ID in local storage
          const {password , ...others} = user._doc
          return res.json({
              message:"login success",
              userDetails:others,
              userId : uid,
              token:token,
              success:true
          })
        }
        else{
          return res.json({
            message:"incorrect password",
            success:false
          })
        }
      });
    }
    else{
      //redirect to signin
      return res.json({
        message:"pls signin first",
        success:false
      })
    }
  }
  catch(err){
    
    return res.json({
      message:"error in logging in",
      error:err.message,
      success:false
    })
  }
}