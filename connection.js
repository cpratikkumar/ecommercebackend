const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connection = async () => {
  try {
    mongoose.connect(process.env.URL).then(() => {
      console.log("Successfully connected with your database");
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = connection;
