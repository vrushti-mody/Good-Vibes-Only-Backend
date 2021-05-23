import jwt from "jsonwebtoken";
const User = require("../db/models/user");
require("dotenv").config();

const AuthController = {
  async googleLogin(req, res, next) {
    if (!req.user) {
      return res.status(401).send({ error: "User was not authenticated" });
    }
    // const { email } = req.user;
    console.log(req.user);
    // const user = await User.findOne({ where: { email } });
    // const token = jwt.sign(user.id, process.env.JWT_SECRET);
    return res.status(200).send({ email });
  },
};

export default AuthController;
