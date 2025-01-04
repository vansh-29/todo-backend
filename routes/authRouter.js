const router = require("express").Router();

const user = require('../models/userModel')
const {protectRoute1} = require('../controller/listController');
//require signuser
const {signUser,getUser,loginUser} = require('../controller/userController')
//sign in 
router.post('/signup' , signUser)
router.post('/login' , loginUser)

router.get('/userDetails/:id' ,protectRoute1, getUser)

module.exports = router;
