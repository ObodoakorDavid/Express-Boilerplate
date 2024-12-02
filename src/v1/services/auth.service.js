import mongoose from "mongoose";
import { generateToken } from "../../config/token.js";
import User from "../models/user.model.js";
import UserProfile from "../models/userProfile.model.js";
import OTP from "../models/otp.model.js";
import ApiError from "../../utils/apiError.js";
import { hashPassword, validatePassword } from "../../utils/validationUtils.js";
import emailUtils from "../../utils/emailUtils.js";
import ApiSuccess from "../../utils/apiSuccess.js"; // Import ApiSuccess

class UserService {
  async findUserByEmail(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.notFound("No user with this email");
    }
    return user;
  }

  async findUserProfileByIdOrEmail(identifier) {
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const userProfile = await UserProfile.findOne(
      isObjectId ? { userId: identifier } : { email: identifier }
    );

    if (!userProfile) {
      throw ApiError.notFound("User Not Found");
    }

    return userProfile;
  }

  async register(userData = {}) {
    const { password } = userData;
    const hashedPassword = await hashPassword(password);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.create(
        [{ ...userData, password: hashedPassword }],
        { session }
      );
      const userProfile = await UserProfile.create(
        [
          {
            userId: user[0]._id,
            ...userData,
          },
        ],
        { session }
      );

      const emailInfo = await emailUtils.sendOTP(
        user[0].email,
        userProfile[0].firstName
      );

      await session.commitTransaction();
      return ApiSuccess.created(
        `Registration Successful, OTP has been sent to ${emailInfo.envelope.to}`,
        { email: user[0].email, id: user[0]._id }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async login(userData = {}) {
    const { email, password } = userData;
    const user = await this.findUserByEmail(email);
    await validatePassword(password, user.password);

    const userProfile = await this.findUserProfileByIdOrEmail(user._id);
    if (!userProfile.isVerified) {
      throw ApiError.forbidden("Email Not Verified");
    }

    const token = generateToken(user._id);
    return ApiSuccess.ok("Login Successful", {
      user: { email: user.email, id: user._id },
      token,
    });
  }

  async getUser(userId) {
    const userProfile = await this.findUserProfileByIdOrEmail(userId);
    return ApiSuccess.ok("User Retrieved Successfully", {
      user: {
        id: userProfile.userId,
        email: userProfile.email,
        firstName: userProfile.firstName,
      },
    });
  }

  async sendOTP({ email }) {
    const userProfile = await this.findUserProfileByIdOrEmail(email);
    if (userProfile.isVerified) {
      return ApiSuccess.ok("User Already Verified");
    }

    const emailInfo = await emailUtils.sendOTP(
      userProfile.email,
      userProfile.firstName
    );

    return ApiSuccess.ok(`OTP has been sent to ${emailInfo.envelope.to}`);
  }

  async verifyOTP({ email, otp }) {
    const userProfile = await this.findUserProfileByIdOrEmail(email);
    if (userProfile.isVerified) {
      return ApiSuccess.ok("User Already Verified");
    }

    const otpExists = await OTP.findOne({ email, otp });
    if (!otpExists || otpExists.expiresAt < Date.now()) {
      throw ApiError.badRequest("Invalid or Expired OTP");
    }

    userProfile.isVerified = true;
    await userProfile.save();
    return ApiSuccess.ok("Email Verified");
  }

  async forgotPassword({ email }) {
    const userProfile = await this.findUserProfileByIdOrEmail(email);
    const emailInfo = await emailUtils.sendOTP(
      userProfile.email,
      userProfile.firstName
    );
    return ApiSuccess.ok(`OTP has been sent to ${emailInfo.envelope.to}`);
  }

  async resetPassword({ email, otp, password }) {
    const user = await this.findUserByEmail(email);
    const otpExists = await OTP.findOne({ email, otp });
    if (!otpExists) {
      throw ApiError.badRequest("Invalid or Expired OTP");
    }

    user.password = await hashPassword(password);
    await user.save();
    return ApiSuccess.ok("Password Updated");
  }
}

export default new UserService();
