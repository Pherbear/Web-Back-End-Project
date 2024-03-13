// Add your mongodb cloud username and password and
// run the app using npm start you will see logs saying
// database connected.

const mongoose = require("mongoose");
const express = require("express");

const blogRoutes = require('./routes/blogRoute');
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');


const app = express();
app.use(express.json())

const dbURI =
  "mongodb+srv://blog_user:<password>@cluster0.q3ijxgk.mongodb.net/BlogDb?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(3000, (req, res) => {
      console.log("Connected to DB listening on port 3000");
    })
  )
  .catch((error) => console.log(error));



  app.use('/blogs', blogRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/admin', adminRoutes);