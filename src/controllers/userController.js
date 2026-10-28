const userService = require('../services/user');

const handle = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const create = handle(async (req, res) => {
    const user = await userService.createUser(req.user, req.body);
    res.status(201).json({ success: true, data: user });
});

const list = handle(async (req, res) => {
    const result = await userService.getUsers(req.user, req.query);
    res.status(200).json({ success: true, ...result });
});

const getOne = handle(async (req, res) => {
    const user = await userService.getUserById(req.user, req.params.id);
    res.status(200).json({ success: true, data: user });
});

const update = handle(async (req, res) => {
    const user = await userService.updateUser(req.user, req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
});

const setStatus = handle(async (req, res) => {
    const user = await userService.setUserStatus(req.user, req.params.id, req.body.status);
    res.status(200).json({ success: true, data: user });
});

module.exports = { create, list, getOne, update, setStatus };