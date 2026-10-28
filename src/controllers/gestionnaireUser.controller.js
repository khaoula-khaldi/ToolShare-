const userService = require("../services/gestionnaireUser.service");

const create = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        
        const user={email,password,name};
        const createUser = await userService.createUser(user);
        return res.status(201).json({
            message:"create user avec succses",
            createUser
        })
    }catch(error){
        return res.status(400).json({
            message : error.message
        });
    }
 
}
module.exports = { create };