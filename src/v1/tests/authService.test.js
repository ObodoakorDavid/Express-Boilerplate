import mongoose from "mongoose";
import userService from "../services/auth.service.js"; // Ensure the path is correct
import User from "../models/user.model.js";
import UserProfile from "../models/userProfile.model.js";
import OTP from "../models/otp.model.js";
import * as validationUtils from "../../utils/validationUtils.js";
import * as emailUtils from "../../utils/emailUtils.js";
import * as tokenUtils from "../../config/token.js";
import ApiError from "../../utils/apiError.js";

jest.mock("../models/user.model.js");
jest.mock("../models/userProfile.model.js");
jest.mock("../models/otp.model.js");
jest.mock("../../utils/validationUtils.js");
jest.mock("../../utils/emailUtils.js");
jest.mock("../../config/token.js");

describe("User Service", () => {
  describe("findUserByEmail", () => {
    it("should return a user when found", async () => {
      const mockUser = { email: "test@example.com" };
      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.findUserByEmail("test@example.com");
      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    });

    it("should throw not found error when user is not found", async () => {
      User.findOne.mockResolvedValue(null);
      await expect(
        userService.findUserByEmail("nonexistent@example.com")
      ).rejects.toThrowError(ApiError.notFound("No user with this email"));
    });
  });

  describe("register", () => {
    it("should successfully register a user", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
      };
      const hashedPassword = "hashed_password";
      const session = await mongoose.startSession(); // Now this will return the mocked session

      const mockUser = [{ _id: "userId123", email: "test@example.com" }];
      const mockUserProfile = [{ userId: "userId123", firstName: "John" }];
      validationUtils.hashPassword.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(mockUser);
      UserProfile.create.mockResolvedValue(mockUserProfile);
      emailUtils.sendOTPViaEmail.mockResolvedValue({
        envelope: { to: ["test@example.com"] },
      });

      const result = await userService.register(userData);

      expect(validationUtils.hashPassword).toHaveBeenCalledWith("password123");
      expect(User.create).toHaveBeenCalledWith(
        [{ ...userData, password: hashedPassword }],
        { session }
      );
      expect(UserProfile.create).toHaveBeenCalledWith(
        [{ userId: "userId123", ...userData }],
        { session }
      );
      expect(emailUtils.sendOTPViaEmail).toHaveBeenCalledWith(
        "test@example.com",
        "John"
      );
      expect(session.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        status_code: 201,
        message: `Registeration Successful, OTP has been sent to test@example.com`,
        data: { email: "test@example.com", id: "userId123" },
      });
    });

    it("should rollback the transaction if registration fails", async () => {
      const userData = { email: "test@example.com", password: "password123" };
      const session = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      };

      mongoose.startSession.mockResolvedValue(session);
      validationUtils.hashPassword.mockResolvedValue("hashed_password");
      User.create.mockRejectedValue(new Error("User creation failed"));

      await expect(userService.register(userData)).rejects.toThrow(
        "User creation failed"
      );
      expect(session.abortTransaction).toHaveBeenCalled();
      expect(session.endSession).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should log in a user with correct credentials", async () => {
      const userData = { email: "test@example.com", password: "password123" };
      const mockUser = {
        _id: "userId123",
        email: "test@example.com",
        password: "hashed_password",
      };
      const mockProfile = { isVerified: true, userId: "userId123" };

      User.findOne.mockResolvedValue(mockUser);
      validationUtils.validatePassword.mockResolvedValue(true);
      UserProfile.findOne.mockResolvedValue(mockProfile);
      tokenUtils.generateToken.mockReturnValue("mockToken");

      const result = await userService.login(userData);

      expect(validationUtils.validatePassword).toHaveBeenCalledWith(
        "password123",
        "hashed_password"
      );
      expect(tokenUtils.generateToken).toHaveBeenCalledWith("userId123");
      expect(result).toEqual({
        success: true,
        status_code: 200,
        message: "Login Successful",
        data: {
          user: { email: "test@example.com", id: "userId123" },
          token: "mockToken",
        },
      });
    });

    it("should throw an error if email is not verified", async () => {
      const userData = { email: "test@example.com", password: "password123" };
      const mockUser = {
        _id: "userId123",
        email: "test@example.com",
        password: "hashed_password",
      };
      const mockProfile = { isVerified: false };

      User.findOne.mockResolvedValue(mockUser);
      validationUtils.validatePassword.mockResolvedValue(true);
      UserProfile.findOne.mockResolvedValue(mockProfile);

      await expect(userService.login(userData)).rejects.toThrow(
        ApiError.forbidden("Email Not Verified")
      );
    });
  });

  describe("verifyOTP", () => {
    it("should verify the OTP successfully", async () => {
      const email = "test@example.com";
      const otp = "123456";
      const mockProfile = { email, isVerified: false, save: jest.fn() };
      const mockOTP = { email, otp };

      UserProfile.findOne.mockResolvedValue(mockProfile);
      OTP.findOne.mockResolvedValue(mockOTP);

      const result = await userService.verifyOTP({ email, otp });

      expect(mockProfile.save).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        status_code: 200,
        message: "Email Verified",
      });
    });

    it("should return error if OTP is invalid", async () => {
      const email = "test@example.com";
      const otp = "123456";

      const userProfile = { email, isVerified: false };

      UserProfile.findOne.mockResolvedValueOnce(userProfile);
      OTP.findOne.mockResolvedValueOnce(null);

      await expect(UserService.verifyOTP({ email, otp })).rejects.toThrow(
        ApiError.badRequest("Invalid or Expired OTP")
      );
      expect(UserProfile.findOne).toHaveBeenCalledWith({ email });
      expect(OTP.findOne).toHaveBeenCalledWith({ email, otp });
    });

    it("should return success if user is already verified", async () => {
      const email = "test@example.com";
      const otp = "123456";

      const userProfile = { email, isVerified: true };

      UserProfile.findOne.mockResolvedValueOnce(userProfile);

      const result = await UserService.verifyOTP({ email, otp });

      expect(UserProfile.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual({
        success: true,
        status_code: 200,
        message: "User Already Verified",
      });
    });
  });
});
