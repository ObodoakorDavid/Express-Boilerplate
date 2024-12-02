import mongoose from "mongoose";

const connectDB = async (url) => {
  return await mongoose.connect(url, {
    dbName: "AppName",
  });
};

export default connectDB;
