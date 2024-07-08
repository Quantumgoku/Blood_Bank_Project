const mongoose = require("mongoose");
const colors = require("colors");
require('dotenv').config;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL,  {

    useNewUrlParser: true,
    useUnifiedTopology: true
  });
    console.log(
      `Connected To Mongodb Database ${mongoose.connection.host}`.bgMagenta
        .white
    );
  } catch (error) {
    console.log(`Mongodb Database Error ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
