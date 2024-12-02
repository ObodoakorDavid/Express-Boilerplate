import cloudinary from "../../lib/cloudinary.config";
import ApiError from "../../utils/apiError.js"; // Import ApiError

// You can import the AWS SDK here in the future

class UploadService {
  // Upload image to Cloudinary
  async uploadToCloudinary(tempFilePath) {
    try {
      const { secure_url } = await cloudinary.v2.uploader.upload(tempFilePath, {
        use_filename: true,
        folder: "AppName",
      });

      return secure_url;
    } catch (error) {
      throw new ApiError(
        500,
        "Error uploading to Cloudinary: " + error.message
      );
    }
  }

  // Placeholder for AWS upload function (you can implement it later)
  async uploadToAWS(tempFilePath) {
    try {
      // AWS upload logic will go here
      // You can use the AWS SDK to upload the image to S3
      return "AWS_upload_url"; // Placeholder
    } catch (error) {
      throw new ApiError(500, "Error uploading to AWS: " + error.message);
    }
  }

  // General method to upload to the selected provider
  async upload(tempFilePath, provider = "cloudinary") {
    try {
      switch (provider.toLowerCase()) {
        case "cloudinary":
          return await this.uploadToCloudinary(tempFilePath);
        case "aws":
          return await this.uploadToAWS(tempFilePath);
        default:
          throw new ApiError(400, `Unsupported upload provider: ${provider}`);
      }
    } catch (error) {
      if (!(error instanceof ApiError)) {
        throw new ApiError(
          500,
          "An unknown error occurred during the upload process"
        );
      }
      throw error; // Re-throw the ApiError if it's already an instance of ApiError
    }
  }
}

export default new UploadService();
