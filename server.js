require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const server = new express();

const {
  errorHandler,
  notFound,
} = require("./src/middlewares/error.middleware");
const quiz = require("./src/routes/quiz.route");
const userrouter = require("./src/routes/user.route");
const categoryrouter = require("./src/routes/category.route");
const questionanswer = require("./src/routes/questionanswer.route");

const corsOptions = {
  origin: "http://localhost:5173", // Allow only requests from this origin
  methods: "GET,POST, PUT, PATCH, DELETE", // Allow only these methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
};

server.use(cors(corsOptions));
server.use(morgan("dev"));
server.use(express.json());

// app router:
server.use("/api/v4", userrouter);
server.use("/api/v4", categoryrouter);
server.use("/api/v4", questionanswer);
server.use("/api/v4", quiz);

server.get("/", (req, res) => {
  res.status(200).json({
    message: "Programming interview question and answer api!",
    status: "success",
  });
});

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
