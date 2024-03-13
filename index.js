// Add your mongodb cloud username and password and
// run the app using npm start you will see logs saying
// database connected.

const mongoose = require("mongoose");
const express = require("express");

const postRoutes = require('./routes/postRoute');
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');


const app = express();
app.use(express.json())

// const dbURI = "mongodb+srv://449_project01:Y1JvCwxzx3pUOksC@cluster0.q3ijxgk.mongodb.net/449?retryWrites=true&w=majorityappName=Cluster0";
// const dbURI = "mongodb+srv://blog_user:nHvCqKgsPabpNQ3X@cluster0.j7sus.mongodb.net/BlogDb?retryWrites=true&w=majority";
const dbURI = "mongodb+srv://449_project01:Y1JvCwxzx3pUOksC@cluster0.j7sus.mongodb.net/449?retryWrites=true&w=majority";


mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(3000, (req, res) => {
      console.log("Connected to DB listening on port 3000");
    })
  )
  .catch((error) => console.log(error));



  app.use('/blogs', postRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/admin', adminRoutes);