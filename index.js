// Add your mongodb cloud username and password and
// run the app using npm start you will see logs saying
// database connected.
require('dotenv').config();

const mongoose = require("mongoose");
const express = require("express");

const postRoutes = require('./routes/postRoute');
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');


const app = express();
app.use(express.json())

const dbURI = process.env.DB_URI;


mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(3000, (req, res) => {
      console.log("Connected to DB listening on port 3000");
    })
  )
  .catch((error) => console.log(error));



  app.use('/posts', postRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/admin', adminRoutes);
  //app.use('/api/viewer', viewerRoutes);
  //app.use('/comment', commentRoutes)