const express = require("express");
const dotenv = require("dotenv");
const connec = require("./connection.js");
const model = require("./usermodel.js");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieparser = require("cookie-parser");
connec();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(cookieparser());
//routes
app.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const { name, phone, email, password } = req.body;
    //check existing user
    const existinguser = await model.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ message: "User already register", status: 400 });
    }

    //password hash
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const saveuser = await new model({
      name,
      phone,
      email,
      password: hash,
    }).save();
    return res.status(200).json({ message: "Successfully register" });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //check userexist or not
    const existinguser = await model.findOne({ email });
    if (!existinguser) {
      return res
        .status(404)
        .json({ message: "User not register ", status: 404 });
    } 
    const checkpassword = bcrypt.compareSync(password, existinguser.password); // true
    if (checkpassword) {
      //authorization
      const token = jwt.sign(
        {
          email,
          password,
        },
        process.env.KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Successfully login",
        status: 200,
        token,
        name: existinguser.name,
      });
    } else {
      return res
        .status(404)
        .json({ message: "password not matched", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: error, status: 404 });
  }
});

app.listen(process.env.PORT, () => {
  console.log("your server has been running on port", process.env.PORT);
});
