const { faker } = require("@faker-js/faker");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodypParser = require("body-parser");
const { Sequelize } = require("sequelize");

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(bodypParser.json());

const securityMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== process.env.PASSWORD) {
    res.status(401).json({ message: "Unauthorized: Invalid password" });
  }
  next();
};

app.use(securityMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/users", (_, res) => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.internet.username(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
    });
  }
  res.status(200).json(users);
});

app.post("/users", (req, res) => {
  const { email, name } = req.body;
  if (!name || !email) {
    res.status(400).json({ message: "Name and email mandatory" });
  }
  const users = {
    id: faker.string.uuid(),
    name,
    email,
    avatar: faker.image.avatar(),
  };
  res.status(201).json(users);
});

app.patch("/users", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = {
    id,
    name,
    email,
    avatar: faker.image.avatar(),
  };
  res.status(200).json(user);
});

app.delete("/users/:id", (_, res) => res.status(204).json());

app.use("*", (_, res) => {
  res.status(404).json({
    message: "404: Not Found - The requested resource could not be located",
  });
});
