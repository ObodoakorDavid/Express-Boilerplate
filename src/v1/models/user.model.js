import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please provide a valid email",
      ],
      unique: [true, "User with this email already exists"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    roles: {
      type: [String],
      enum: ["user", "admin"],
      default: ["user"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
