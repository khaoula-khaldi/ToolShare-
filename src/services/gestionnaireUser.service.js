const userRepository = require("../repositories/user.repo");
const bcrypt= require("bcrypt");

const createUser = async(data)=>{
    const {name,email,password} = data;
    const passwordHash = await bcrypt.hash(password ,10);
    const role = "user" ;
    const user = {name,email,password:passwordHash,role}
    const emailExisting = await userRepository.findByEmail(email);
    if(emailExisting){
        throw new Error("ce mail est déja utiliser à une autre compte");
    }

    const create = await userRepository.create(user);
    return create;
}

module.exports = {createUser}