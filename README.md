# Mexican Train Dominoes Game

In this code base, you will find the implementation of our multiplayer game, Mexican Train Dominoes.

There is also the ASP.NET REST API backend which is in place in the JavaScript files and can be found at [https://github.com/max7piper/choo-choo-champions-api](https://github.com/max7piper/choo-choo-champions-api).

### Deployment:

Our app is deployed via [Google Firebase](https://firebase.google.com/) at [https://mexicantraindomino.web.app/](https://mexicantraindomino.web.app/).

The backend is deployed via [Microsoft Azure](https://azure.microsoft.com/en-us) at [https://choochoochampionsapi.azurewebsites.net/swagger/index.html](https://choochoochampionsapi.azurewebsites.net/swagger/index.html).

To run the app locally, follow these steps.

### Running the App Locally:

#### Step 0:

Ensure that you have Node.js downloaded from [https://nodejs.org/en/download](https://nodejs.org/en/download).

#### Step 1:

Open a terminal and clone the repository using ```git clone```

#### Step 2:

In the root directory, install dependencies using ```npm install```

#### Step 3:

Also, in the root directory, start the website or run unit tests:

```npm start``` or ```npm run coverage```

#### Step 4:

If you ran ```npm start```, you will see our React app website. If you ran ```npm run coverage```, you will see our unit test results.

# API Documentation

## Endpoints

### 1. Register User
- **Method**: POST
- **Endpoint**: `/user/register`
- **Parameters**:
  - `username` (string, query): The desired username.
  - `password` (string, query): The user's password.
  - `email` (string, query): The user's email address.
- **Response**:
  - **Code**: 200 - Success

### 2. User Login
- **Method**: POST
- **Endpoint**: `/user/login`
- **Parameters**:
  - `username` (string, query): Username for login.
  - `password` (string, query): Password for login.
- **Response**:
  - **Code**: 200 - Success

### 3. Get User Profile
- **Method**: GET
- **Endpoint**: `/user/Profile/{username}`
- **Parameters**:
  - `username` (string, path): Username whose profile is being requested.
- **Response**:
  - **Code**: 200 - Success

### 4. Change Password
- **Method**: POST
- **Endpoint**: `/user/changePassword`
- **Parameters**:
  - `username` (string, query): Username for password change.
  - `oldPassword` (string, query): Current password.
  - `newPassword` (string, query): New password.
- **Response**:
  - **Code**: 200 - Success

### 5. Send Email Verification
- **Method**: POST
- **Endpoint**: `/user/sendEmailVerification`
- **Parameters**:
  - `username` (string, query): Username associated with the email.
  - `email` (string, query): Email address to be verified.
- **Response**:
  - **Code**: 200 - Success

### 6. Verify Email Code
- **Method**: POST
- **Endpoint**: `/user/verifyEmailCode`
- **Parameters**:
  - `username` (string, query): Username for verification.
  - `code` (integer, query): Verification code.
- **Response**:
  - **Code**: 200 - Success

### 7. Update Username
- **Method**: POST
- **Endpoint**: `/user/updateUsername`
- **Parameters**:
  - `username` (string, query): Current username.
  - `newUsername` (string, query): New username.
- **Response**:
  - **Code**: 200 - Success

### 8. Update Email
- **Method**: POST
- **Endpoint**: `/user/updateEmail`
- **Parameters**:
  - `username` (string, query): Current username.
  - `newEmail` (string, query): New email address.
- **Response**:
  - **Code**: 200 - Success

### 9. Update Stats
- **Method**: POST
- **Endpoint**: `/user/updateStats`
- **Parameters**:
  - `username` (string, query): Username.
  - `score` (integer, query): Score to update.
  - `wonRound` (boolean, query): Indicates if the round was won.
  - `wonGame` (boolean, query): Indicates if the game was won.
  - `endGame` (boolean, query): Indicates if the game has ended.
- **Response**:
  - **Code**: 200 - Success

