const {loginUser} = require('../services/auth');


const login = async (req,res) => {
    const data = await loginUser(req.body);
    return res.status(200).json({data : data}); 
}



module.exports = {login}