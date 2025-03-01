const { log } = require("winston");
const db = require("../middleware/database");
const logger = require("../services/logger");
const bcrypt = require("bcrypt");
const sendOTPToEmail = require("../middleware/otp.send");
const { GeneralError, BadRequest } = require("../utils/error");
const responseStatus = require("../utils/enum");
const { StatusCodes } = require("http-status-codes");
const message = require("../utils/message");
const { GeneralResponse } = require("../utils/responce");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw "All Field are Required";

    const [existingUser] = await db.execute(
      "SELECT * FROM user WHERE email = ? ",
      [email]
    );
    if (existingUser[0]) {
      return next(
        (new GeneralResponse(
          responseStatus.RESPONSE_ERROR,
          StatusCodes.OK,
          message.MESSAGE,
          undefined
        ))
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);

    const user = await db.query(
      "INSERT INTO user (name, email, password) VALUES(?, ?, ?)",
      [name, email, hashpass]
    );
    return res
      .status(201)
      .send({ success: true, message: "User Added SuccessFully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error in Server", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw "All field are Required";

    const [user] = await db.query("SELECT * FROM user WHERE email=? ", [email]);
    if (user.length === 0) {
      throw "User not found";
    }
    const passvalid = await bcrypt.compare(password, user[0].password);
    if (!passvalid) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Password Provided" });
    }
    const Jwt_Secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email },
      Jwt_Secret,
      { expiresIn: "5d" }
    );

    res.header("token", token);

    return res
      .status(200)
      .send({ success: true, message: "Login SuccessFully", token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error in Server", error });
  }
};

const UsersData = async (req, res) => {
  try {
    const [user] = await db.query(" SELECT * FROM user ");
    if (user.length === 0) {
      return res.status(404).send({ success: false, message: "No Data Found" });
    }
    return res.status(200).send({
      success: true,
      message: "All Users Records",
      total_Users: user.length,
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error in Server", error });
  }
};

const ViewuserById = async (req, res) => {
  try {
    const use_id = req.user_data.id;
    const [user] = await db.query("SELECT * FROM user WHERE id = ?", [use_id]);
    if (user.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "User Not Found With Provided ID" });
    }
    return res
      .status(200)
      .send({ success: true, message: "User Match With ID", user: user[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error", error });
  }
};

const ViewByPagination = async (req, res) => {
  try {
    let { page, data, sortBy, orderBy } = req.body;
    const [user] = await db.query("SELECT * FROM user");

    let StartIndex = (page - 1) * 5;
    let EndIndex = StartIndex + data;

    const show = user.slice(StartIndex, EndIndex);

    if (sortBy === "id") {
      let isdescending = show[0].id > show[show.length - 1].id;
      show.sort((a, b) => (isdescending ? a.id - b.id : b.id - a.id));
    }

    return res.status(200).send({ user: show });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error", error });
  }
};

const Sent_Otp = async (req, res) => {
  try {
    const email = req.user_data.email;

    const [user] = await db.query(" SELECT * FROM user WHERE email=?", [email]);

    if (user.length === 0) {
      return res.status(404).send({
        success: false,
        message: "User Not Found With Provided Email",
      });
    }

    await sendOTPToEmail(user[0].email);

    return res
      .status(200)
      .send({ success: true, message: `Otp Send On ${email}` });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Server Got A Error", error });
  }
};

const ResetPasswordViaEmail = async (req, res) => {
  try {
    const email = req.user_data.email;
    const { otp } = req.body;

    const [user] = await db.query(" SELECT * FROM user WHERE email=?", [email]);

    if (user.length === 0) {
      logger.error(`User is not found.`);
      return res.status(200).send({
        statusCode: 400,
        status: "Success",
        message: "User is not found.",
      });
    }

    const [otp_user] = await db.query(
      " SELECT * FROM otp_verifications WHERE email=?",
      [email]
    );

    if (otp_user[0].otp !== otp) {
      await db.query("DELETE FROM otp_verifications WHERE email=?", [email]);
      return res
        .status(400)
        .send({ success: false, message: "OTP Not Match or Expired !" });
    }

    const currentTime = new Date();
    if (otp_user[0].expires_at < currentTime) {
      await db.query("DELETE FROM otp_verifications WHERE email=?", [email]);
      return res
        .status(400)
        .send({ success: false, message: "OTP has expired" });
    }

    await db.query("DELETE FROM otp_verifications WHERE email=?", [email]);

    return res.status(200).send({
      
      success: true,
      message: 'You Redirect Successfully "Reset Password Page"',
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Server Got A Error", error });
  }
};

module.exports = {
  register,
  login,
  UsersData,
  ViewuserById,
  ViewByPagination,
  ResetPasswordViaEmail,
  Sent_Otp,
};
