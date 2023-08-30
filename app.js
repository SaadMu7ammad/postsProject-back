const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors());
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
// app.use((req, res, next) => {
  //     res.setHeader('Access-Control-Allow-Origin', '*');
  //     res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //     next();
  // });
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images');
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4());
    },
  });
  app.use('/images', express.static(path.join(__dirname, 'images')));
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use((error, req, res, next) => {
  console.log(error);
  const status = err.statusCode;
  const message = err.message;
  const data = error.data
  res.status(status).json({ message: message,data:data });
});
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
mongoose
  .connect(process.env.URL_DB)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
