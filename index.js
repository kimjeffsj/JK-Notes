const express = require("express");
require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Middlewares
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views/"));

app.use(express.static(path.join(__dirname + "/public")));

// Routes
const main = require("./routes/main");

app.use("/", main);

app.listen(PORT, () => console.log(`JK Notes Server is Running on ${PORT}`));
