import mongoose from "mongoose";

const { Schema } = mongoose;

const UserProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: [true, "Please provide a firstName"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a firstName"],
    },
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
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number"],
      match: [
        /^(0)(7|8|9){1}(0|1){1}[0-9]{8}$/,
        "Please enter a valid Nigerian phone number",
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/demmgc49v/image/upload/v1695969739/default-avatar_scnpps.jpg",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserProfile", UserProfileSchema);
