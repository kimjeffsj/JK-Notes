const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const main = require("./routes/main");
const { notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views/"));
app.use(express.static(path.join(__dirname + "/public/")));

// Routes
app.use("/", main);

// Error handlers
app.use(notFound);

app.listen(PORT, () => console.log(`JK Notes Server is Running on ${PORT}`));
