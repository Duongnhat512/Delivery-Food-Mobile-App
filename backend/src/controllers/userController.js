const userModel = require('../models/userModel');

const getUserById = async (userId) => {
    try{
        const user = userModel.getUserById(userId)
        return user;
    }catch(error){
        throw new Error(error.message);
    }
}

module.exports = {
    getUserById,
}