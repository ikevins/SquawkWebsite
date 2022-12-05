const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const userRoute = require('./api/routes/userRoute');
const yelpRoute = require('./api/routes/yelpRoute');
const cookieParser = require("cookie-parser");

const app = express();
const path = require('path');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());


//Api routes for any user function
app.use('/api', userRoute);
app.use('/yelp', yelpRoute);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}



const PORT = process.env.PORT || 5000;

//mongoose connect to Datebae
mongoose
  .connect(process.env.MONGODB_URI) //.env file is now MONGO_URI instead of MONGODB_URI
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

  module.exports = app; //send the app model to routes.test.js