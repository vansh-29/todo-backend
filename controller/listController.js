const userModel = require('../models/userModel')
const listModel = require('../models/listModel')
const jwt = require('jsonwebtoken')
let JWT_KEY = 'qriv37fj48fk294J'

module.exports.newTask = async function newTask(req,res){
    try{
        const uid = req.params.id;
        const {title,body} = req.body;
        if(!title || !body ){
            return res.status(404).json({
                message:"enter all details properly"
            })
        }
        const user1 = await userModel.findById(uid)
        const newlist = await listModel.create({
            title:title,
            body:body,
            user:user1
        })
        user1.list.push(newlist._id);
        await user1.save();
        const list = await listModel.find({user:uid}).sort({createdAt:1});
        return res.status(200).json({
            message:"task created successfully",
            task:newlist,
            allTasks:list,
            success:"true"
        })
    }
    catch(err){
        return res.json({
            message:"error in creating new task",
            error:err.message,
            success:"false"
        })
    }
}
module.exports.protectRoute1=async function protectRoute1(req,res,next){
    try{
        let token;
        console.log("protect1",req.cookies)
        console.log("protect2",req.cookies.login)
        if(req.cookies && req.cookies.login){
            token=req.cookies.login;
            let decodedPayload = jwt.verify(token,JWT_KEY)
            if(decodedPayload){
                let userId = decodedPayload.payload
                console.log('decodedPayload is',decodedPayload)
                const user = await userModel.findById(userId)
                req.role=user.role;
                req.id= userId;
                console.log('id',req.id)
                next();
            }
            else{
                const client = req.get('User-Agent')
                if(client.includes("Chrome")){
                    return res.redirect('/login')
                }
                else{
                    return res.json({
                    message:"user not verified"
                    })
                }
            }
        }
        else{
            return res.json({
                message:"please login correctly",
                success:false
            })
        }
    }
    catch(err){
        return res.json({
            message:err.message,
            success:false
        })
    }
}


module.exports.updateTask = async function updateTask(req,res){
    try{
        let id = req.params.id
        console.log(id);
        let dataToBeUpdated = req.body
        let keys=[];
        for(let key in dataToBeUpdated){
            keys.push(key)
        }
        let list = await listModel.findById(id) 
        console.log("list is",list);    
        for(let i=0;i<keys.length;i++){
            list[keys[i]] = dataToBeUpdated[keys[i]];
        }

        await list.save()
        const updatedList = await listModel.find({user:list.user[0]}).sort({createdAt:1});
        console.log("updated list is" ,updatedList)
        return res.json({
            message:"list updated successfully",
            data:list,
            allTasks:updatedList,
            success:"true",
        })
        // update from user list array also

    }
    catch(err){
        return res.json({
            message:"error in updating task",
            error:err.message,
            success:"false"
        })
    }
}


module.exports.deleteList = async function deleteList(req,res){
    try{
        let taskid = req.params.id
        let taskToBeDeleted = await listModel.findByIdAndDelete(taskid);

        let user = await userModel.findByIdAndUpdate(taskToBeDeleted.user[0] , {$pull : {list:taskid}})
        const allTasks = await listModel.find({user:user._id}).sort({createdAt:1})
        return res.json({
            message:"task deleted successfully",
            task:allTasks,
            user:user,
            success:"true"
        })
    }
    catch(err){
        return res.json({
            message:"Error deleting task",
            error:err.message,
            success:false
        })
    }
}


module.exports.getList = async function getList(req,res){
    try{
        let uid = req.params.id;
        const list = await listModel.find({user:uid}).sort({createdAt:1})
        if(list.length == 0){
            return res.json({
                message : "the user has no tasks to do"
            })
        }
        return res.status(200).json({
            message:"all tasks",
            number:list.length,
            tasks:list,
            success:true,
        })
    }
    catch(err){
        return res.json({
            message:'error in getting tasks',
            error:err.message,
            success:false
        })
    }
}


