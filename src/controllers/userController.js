const userService = require('../services/user');
const asyncHandler = require('../utils/AsyncHandler');



const create = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.user, req.body);
    res.status(201).json({ success: true, data: user });
});

const list = asyncHandler(async (req, res) => {
    const result = await userService.getUsers(req.user, req.query);
    res.status(200).json({ success: true, ...result });
});

const getOne = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user, req.params.id);
    res.status(200).json({ success: true, data: user });
});

const update = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.user, req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
});

const setStatus = asyncHandler(async (req, res) => {
    const user = await userService.setUserStatus(req.user, req.params.id, req.body.status);
    res.status(200).json({ success: true, data: user });
});

module.exports = { create, list, getOne, update, setStatus };