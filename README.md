# Express Boilerplate with Authentication

This is a basic Express boilerplate with authentication using JWT. It is designed to kickstart your application with minimal setup, providing essential features such as user registration, login, password reset, and email verification.

## Features

- **User Registration**: Register new users and store their information securely in MongoDB.
- **User Login**: Authenticate users via email and password.
- **JWT Authentication**: Secure routes with JSON Web Tokens (JWT).
- **Forgot Password**: Send password reset links via email.
- **Email Verification**: Verify user accounts through an OTP sent to their email.
- **Cloudinary Integration**: Handle user profile image uploads with Cloudinary.
- **Brevo Email Integration**: Use Brevo (formerly Sendinblue) for sending emails.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side logic.
- **Express.js**: Fast and minimalist web framework for Node.js.
- **MongoDB**: NoSQL database to store user data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **JWT**: JSON Web Tokens for securing API endpoints.
- **Cloudinary**: Image and video management platform.
- **Brevo (Sendinblue)**: Email service for transactional and marketing emails.

## Prerequisites

- **Node.js** (version 12 or higher)
- **MongoDB** (either installed locally or use MongoDB Atlas for cloud DB)
- **Cloudinary Account** (for managing file uploads)
- **Brevo Account** (for email services)

## Getting Started

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/express-boilerplate.git
    ```

2. Navigate into the project directory:
    ```bash
    cd express-boilerplate
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and configure the following environment variables.

### Environment Variables

Create a `.env` file in the root of your project and add the following configuration:

| **Variable**                | **Description**                                         | **Example**                                      |
|-----------------------------|---------------------------------------------------------|--------------------------------------------------|
| `NODE_ENV`                   | Defines the environment mode (development or production) | `development`                                   |
| `JWT_SECRET`                 | Secret key used to sign JWT tokens                      | `your_jwt_secret`                               |
| `JWT_LIFETIME`               | Duration for which the JWT is valid                     | `7d`                                            |
| `DB_URI`                     | MongoDB URI for the database connection                  | `mongodb://localhost:27017/your-database-name`  |
| `BREVO_EMAIL`                | Email address used with Brevo for sending notifications | `your_email@example.com`                       |
| `BREVO_PASSWORD`             | Password for the Brevo email account                     | `your_brevo_password`                          |
| `CLOUDINARY_NAME`            | Cloudinary account name                                  | `your_cloudinary_name`                         |
| `CLOUDINARY_API_KEY`         | API key for accessing Cloudinary services                | `your_cloudinary_api_key`                       |
| `CLOUDINARY_API_SECRET`      | Secret key for Cloudinary API                            | `your_cloudinary_api_secret`                   |

### Running the App

To run the application in development mode:

```bash
npm run dev
```

The server will start at `http://localhost:3000` or the port specified in your `.env` file.

### Testing the App

You can test the API using Postman or any other API client. Below are the available endpoints with example request bodies.

## API Endpoints

### 1. Register User

- **Endpoint**: `POST /api/v1/auth/register`
- **Description**: Register a new user.
- **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!",
      "firstName": "John",
      "phoneNumber": "08012345678"
    }
    ```
- **Response**:
    ```json
    {
      "success": true,
      "status_code": 201,
      "message": "Registration Successful, OTP has been sent to user@example.com",
      "data": {
        "email": "user@example.com",
        "id": "user_id"
      }
    }
    ```

### 2. Login User

- **Endpoint**: `POST /api/v1/auth/login`
- **Description**: Login a user.
- **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!"
    }
    ```
- **Response**:
    ```json
    {
      "success": true,
      "status_code": 200,
      "message": "Login Successful",
      "data": {
        "user": {
          "email": "user@example.com",
          "id": "user_id"
        },
        "token": "jwt_token"
      }
    }
    ```

### 3. Forgot Password

- **Endpoint**: `POST /api/v1/auth/forgot-password`
- **Description**: Trigger forgot password email.
- **Request Body**:
    ```json
    {
      "email": "user@example.com"
    }
    ```
- **Response**:
    ```json
    {
      "success": true,
      "status_code": 200,
      "message": "Password reset link sent to user@example.com"
    }
    ```

### 4. Reset Password

- **Endpoint**: `POST /api/v1/auth/reset-password`
- **Description**: Reset user password.
- **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "otp": "123456",
      "password": "NewPassword123!"
    }
    ```
- **Response**:
    ```json
    {
      "success": true,
      "status_code": 200,
      "message": "Password has been reset successfully"
    }
    ```

### 5. Verify OTP

- **Endpoint**: `POST /api/v1/auth/verify-otp`
- **Description**: Verify OTP sent via email.
- **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "otp": "123456"
    }
    ```
- **Response**:
    ```json
    {
      "success": true,
      "status_code": 200,
      "message": "OTP verified successfully"
    }
    ```

## Folder Structure

```
.
├── config                # Configuration files (e.g., DB connection)
├── middlewares           # Custom Express middlewares
├── templates             # Templates for responses or emails
├── utils                 # Utility functions (e.g., email sending, token generation)
├── v1                    # Version 1 API folder
│   ├── controllers       # Route controllers for handling requests
│   ├── routes            # Express routes for the API
│   ├── models            # Mongoose models (User, UserProfile, etc.)
│   ├── services          # Business logic separated from controllers
│   └── validators        # Validation logic for request data
├── .env                  # Environment configuration
├── gitignore              # Git ignore file
├── app.js                # Main application file
├── package-lock.json     # NPM lock file
├── package.json          # NPM dependencies and scripts
└── README.md             # Project documentation
```

## License

This project is licensed under the MIT License.

---

This version of the `README.md` correctly reflects the updated folder structure with environment files and configurations outside the `src` directory.