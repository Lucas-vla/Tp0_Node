require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodypParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(bodypParser.json());

//connexion DB
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);
const connectionToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectionToDb();

// middleware sécu
app.use((req, res, next) => {
  if (process.env.PASSWORD !== req.headers.authorization) {
    return res.status(401).json("le pass est incorect");
  }
  next();
});

const UserModel = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

//Sync de la BD
const syncDB = async () => {
  await sequelize.sync({ alter: true });
};
syncDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Get (récuperer une info) /users => récuperer les users
app.get("/users", async function (_, res) {
  const users = await UserModel.findAll();
  res.status(200).json(users);
});

// POST (créer une entrée en BD) /users => créer un user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ message: "Name and email mandatory" });
  }
  const user = UserModel.create({
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
  });
  res.status(201).json(user);
});

// PATCH MAJ d'un user en particulier
app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = await UserModel.findByPk(id);
  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();
  res.status(200).json(user);
});

// Supression d'un user par son ID
app.delete("/users/:id", async (req, res) => {
  await UserModel.destroy({ where: { id: req.params.id } }),
    res.status(204).json();
});

app.use("*", (_, res) => {
  res.status(404).json({
    message: "404: Not Found - The requested resource could not be located",
  });
});
