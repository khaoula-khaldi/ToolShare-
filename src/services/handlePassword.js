const { hash, compare } = require("bcrypt");



async function hashPassword(password) {
    return await hash(password,10)
}



async function checkPassword(password,hashedPassword) {
    return await compare(password,hashedPassword);
}


module.exports = {hashPassword,checkPassword}