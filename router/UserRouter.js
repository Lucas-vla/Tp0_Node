const express = require("express");
const {
  getAllUsers,
  getOneUser,
  createUser,
  patchUser,
  deleteUser,
} = require("../controllers/UserController");
const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getOneUser);
userRouter.post("/users", createUser);
userRouter.patch("/users/:id", patchUser);
userRouter.delete("/users/:id", deleteUser);

module.exports = { userRouter };
