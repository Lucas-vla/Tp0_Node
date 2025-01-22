const { UserModel } = require("../models/userModel");

const createUser = async (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json("Email and name are required");
  }
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
  });

  return res.status(201).json(user);
};

const getAllUsers = async (_, res) => {
  const users = await UserModel.findAll();
  return res.status(200).json(users);
};

const getOneUser = async (req, res) => {
  const user = await UserModel.findOne({
    where: {
      id: req.params.id,
    },
  });
  return res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  await UserModel.destroy({
    where: {
      id: req.params.id,
    },
  });
  return res.status(204).json();
};

const patchUser = async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;

  const user = await UserModel.findByPk(id);
  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();
  return res.status(201).json(user);
};

module.exports = { createUser, getAllUsers, deleteUser, patchUser, getOneUser };
