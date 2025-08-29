// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const mongoose=require('mongoose');
// const cookieParser=require('cookie-parser');
// const userRoute=require('./routes/user');
// const blogRoute=require('./routes/blog');
// const Blog=require('./models/blog');
// const { checkForAuthenticationCookie } = require("./middleware/authentication");


// const app = express();
// const PORT = process.env.PORT || 8000;

// mongoose.connect(process.env.MONGO_URL).then(e=>console.log('MongoDB Connected'));

// // set EJS as template engine
// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));

// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(checkForAuthenticationCookie('token'));
// app.use(express.static(path.resolve('./public')));
// // routes
// app.get("/", async (req, res) => {
//   const allBlogs=await Blog.find({});
//   res.render("home",{
//     user: req.user,
//     blogs: allBlogs,
//   });
// });

// app.use("/user",userRoute)
// app.use("/blog",blogRoute)

// // app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));

// module.exports = app;



require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");
const { checkForAuthenticationCookie } = require("./middleware/authentication");

const app = express();

// --- Database connection ---
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Template engine ---
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// --- Middleware ---
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// --- Routes ---
app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// --- Local development vs Vercel ---
if (require.main === module) {
  // Only run app.listen locally
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running locally at http://localhost:${PORT}`)
  );
} else {
  // Export app for Vercel
  module.exports = app;
}
