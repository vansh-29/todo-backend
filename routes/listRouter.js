const express = require('express');
const { protectRoute1 ,newTask, updateTask, deleteList,getList} = require('../controller/listController');
const listRouter = express.Router();


listRouter.use(protectRoute1)
listRouter.post('/add/:id' , newTask)
listRouter.put('/update/:id' , updateTask)
listRouter.delete('/delete/:id' , deleteList)
listRouter.get('/get/:id' , getList)



module.exports = listRouter