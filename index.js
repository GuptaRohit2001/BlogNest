const express = require("express");
const path = require("path");
const mongoose=require('mongoose');

const userRoute=require('./routes/user');

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/blogify').then(e=>console.log('MongoDB Connected'));

// set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

// routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user",userRoute)

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
