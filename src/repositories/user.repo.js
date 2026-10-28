const User = require('../models/User');


const create = (data) => User.create(data);

const findById = (id) => User.findById(id);

const findByEmail = (email, withPassword = false) => {
    const query = User.findOne({ email });
    return withPassword ? query.select('+password') : query;
};

const findAll = (filter = {}, { skip = 0, limit = 20 } = {}) =>
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

const count = (filter = {}) => User.countDocuments(filter);

const updateById = (id, data) => User.findByIdAndUpdate(id, data, { new: true, runValidators: true });


const deleteById = (id) => User.findByIdAndDelete(id);



module.exports = { create, findById, findByEmail, findAll, count, updateById, deleteById };