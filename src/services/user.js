const  {create,findByEmailWithPassword} = require("../repositories/user.repo"); 
const { hashPassword } = require("./handlePassword");



async function handleCreateGestionnaire(role , data) {
    if(role !== 'admin'){
     throw new AppError('you do not have permission to create Gestionnaire' , 403);
    }

    const user = await findByEmailWithPassword(data.email);
    if(user) throw new AppError('email is already there' , 409);

    const hashPass = await hashPassword(data.password)
    const creation = await create({
        name : data.name,
        email : data.email,
        password : hashPass,
        role : 'gestionnaire'
    })

    return {
        name : creation.name,
        email : creation.email,
        role : creation.role
    }
}



module.exports = {handleCreateGestionnaire}