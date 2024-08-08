require("dotenv").config();
const express = require("express");
const server = new express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const {
  errorHandler,
  notFound,
} = require("./src/middlewares/error.middleware");
const userrouter = require("./src/routes/user.route");
const categoryrouter = require("./src/routes/category.route");
const questionanswer = require("./src/routes/questionanswer.route");
const quiz = require("./src/routes/quiz.route");

server.use(cors());
server.use(morgan("dev"));
server.use(express.json());

// app router:
server.use("/api/v4", userrouter);
server.use("/api/v4", categoryrouter);
server.use("/api/v4", questionanswer);
server.use("/api/v4", quiz);

// error Middleware:
server.use(notFound);
server.use(errorHandler);

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("Server listening on port ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
