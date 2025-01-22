require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const { authenticate } = require("./middlewares/AuthMiddleware");
const { userRouter } = require("./router/UserRouter");

const app = require("express")();

const start = async () => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(authenticate);
  app.use(userRouter);
  app.use("*", (_, res) => {
    res.status(404).json({
      message: "404: Not Found - The requested resource could not be located",
    });
  });
  app.listen(process.env.PORT, () => {
    console.info(`Application est en cours sur le port ${process.env.PORT}`);
  });
};
start();
