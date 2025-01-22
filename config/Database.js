const { Sequelize } = require("sequelize");

class DbConfigurator {
  constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
      }
    );
  }

  getSequelize = () => {
    return this.sequelize;
  };

  connect = async () => {
    try {
      const UserModel = require("../models/UserModel");
      await this.sequelize.authenticate();
      await UserModel.sync({ alter: true });
      console.log("Co ok to db");
    } catch (error) {
      console.log("Impossible to connect to the DB", error);
    }
  };
}

module.exports = DbConfigurator;
