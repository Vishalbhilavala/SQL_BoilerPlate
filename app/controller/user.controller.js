const db = require('../middleware/database');
const logger = require('../services/logger');
const bcrypt = require('bcrypt');
const sendOTPToEmail = require('../middleware/otp.send');
const { GeneralError, BadRequest } = require('../utils/error');
const responseStatus = require('../utils/enum');
const { StatusCodes } = require('http-status-codes');
const message = require('../utils/message');
const { GeneralResponse } = require('../utils/responce');
const jwt = require('jsonwebtoken');
const {
  registration_validate,
  login_validate,
  verifyotp_validate,
  forgotPassword_validate,
} = require('../validation/uservalidate');

module.exports = {
  registration: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const { error } = registration_validate.validate(req.body);

      if (error) {
        logger.error('Error from registration validate');

        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: `${error.details[0].message}`,
        });
      }

      const [user_existed] = await db.query(
        'SELECT * FROM user WHERE email = ?',
        [email]
      );

      if (user_existed.length > 0) {
        logger.error(`User already exists.`);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: 'User already exist',
          user: user_existed,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(password, salt);

      const [user] = await db.query(
        'INSERT INTO user (name, email, password) VALUES(?, ?, ?)',
        [name, email, hashpass]
      );
      logger.info('You are registred successfully.');
      return res.json({
        statusCode: StatusCodes.CREATED,
        status: responseStatus.RESPONSE_SUCCESS,
        message: 'You are registred successfully.',
      });
    } catch (error) {
      logger.error('Unexpected error:', error.message);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const { error } = login_validate.validate(req.body);
      if (error) {
        logger.error('all required.');

        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: `${error.details[0].message}`,
        });
      }

      const [user] = await db.query('SELECT * FROM user WHERE email=? ', [
        email,
      ]);
      if (user.length === 0) {
        throw 'User not found';
      }
      const passvalid = await bcrypt.compare(password, user[0].password);
      if (!passvalid) {
        return res
          .status(400)
          .send({ success: false, message: 'Invalid Password Provided' });
      }
      const Jwt_Secret = process.env.JWT_SECRET;
      const token = jwt.sign(
        { id: user[0].id, email: user[0].email },
        Jwt_Secret,
        { expiresIn: '5d' }
      );

      res.header('token', token);

      return res
        .status(200)
        .send({ success: true, message: 'Login SuccessFully', token });
    } catch (error) {
      logger.error('Unexpected error:', error.message);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  viewProfile: async (req, res) => {
    try {
      const use_id = req.user_data.id;
      
      const [user] = await db.query('SELECT * FROM user WHERE id = ?', [
        use_id,
      ]);

      if (user.length === 0) {
        return res.json({
          statusCode: StatusCodes.UNAUTHORIZED,
          status: responseStatus.RESPONSE_ERROR,
          message: 'User Not Found With Provided ID',
        });
      }

      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: 'User Match With ID',
        user,
      });

    } catch (error) {

      logger.error('Unexpected error:', error.message);

      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  getListOfUser: async (req, res) => {
    try {
      let { page, data, sortBy, orderBy = 'asc', search } = req.body;
      const [user] = await db.query('SELECT * FROM user');

      if (user.length === 0) {
        logger.error(`User's Data is Empty.`);
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `User's Data is Empty.`,
        });
      }

      let filteredUser = user;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredUser = user.filter(
          (user_data) =>
            user_data.name.toLowerCase().includes(searchLower) ||
            user_data.email.toLowerCase().includes(searchLower)
        );
      }

      if (sortBy && filteredUser.length > 0) {
        filteredUser.sort((a, b) => {
          if (orderBy === 'desc') {
            return b[sortBy] > a[sortBy] ? 1 : -1;
          } else {
            return a[sortBy] > b[sortBy] ? 1 : -1;
          }
        });
      }

      let StartIndex = (page - 1) * data;
      let EndIndex = StartIndex + data;

      const show = filteredUser.slice(StartIndex, EndIndex);

      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: "List Of all User's",
        user: show,
      });
    } catch (error) {
      logger.error('Unexpected error:', error.message);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { email } = req.body;

      const [user] = await db.query(' SELECT * FROM user WHERE email=?', [
        email,
      ]);

      if (user.length === 0) {
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: 'User Not Found With Provided Email',
        });
      }

      await sendOTPToEmail(user[0].email);

      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Otp Send On ${email}`,
      });
    } catch (error) {
      logger.error('Unexpected error:', error.message);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { otp, email } = req.body;

      const { error } = verifyotp_validate.validate(req.body);

      if (error) {
        logger.error('OTP and email are required');

        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: `${error.details[0].message}`,
        });
      }

      const [user] = await db.query(' SELECT * FROM user WHERE email=?', [
        email,
      ]);

      if (user.length === 0) {
        logger.error(`User is not found.`);
        return res.status(200).send({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: 'User is not found.',
        });
      }

      const [otp_user] = await db.query(
        ' SELECT * FROM otp_verifications WHERE email = ?',
        [email]
      );

      if (!otp_user || otp_user.length === 0) {
        await db.query('DELETE FROM otp_verifications WHERE email=?', [email]);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: 'OTP Not Match or Expired !',
        });
      }

      if (otp_user[0].otp !== otp) {
        await db.query('DELETE FROM otp_verifications WHERE email=?', [email]);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: 'OTP does not match or has expired!',
        });
      }

      const currentTime = new Date();
      if (otp_user[0].expires_at < currentTime) {
        await db.query('DELETE FROM otp_verifications WHERE email=?', [email]);
        return res.status(400).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: 'OTP has expired',
        });
      }

      await db.query('DELETE FROM otp_verifications WHERE email=?', [email]);

      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: 'You Redirect Successfully "Reset Password Page',
      });
    } catch (error) {
      logger.error('Unexpected error:', error.message);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email, newpassword, confirmpassword } = req.body;

      const { error } = forgotPassword_validate.validate({
        newpassword,
        confirmpassword,
      });
      if (error) {
        logger.error('Password validation error.', error.details[0].message);

        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: `${error.details[0].message}`,
        });
      }

      const [user] = await db.query(' SELECT * FROM user WHERE email=?', [
        email,
      ]);

      if (user.length === 0) {
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: 'User Not Found With Provided Email',
        });
      }
      const passmatch = await bcrypt.compare(newpassword, user[0].password);
      if (passmatch) {
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: 'New Password and Old Password Is Same',
        });
      }

      const hashpassword = await bcrypt.hash(newpassword, 10);
      await db.query('UPDATE user SET password = ? WHERE email = ?', [
        hashpassword,
        email,
      ]);

      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: message.UPDATE_PASSWORD,
      });
    } catch (error) {
      logger.error('Unexpected error:', error.message);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },
};
