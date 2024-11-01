# 🌟 Session Based User Auth in Vanilla Node.js

Welcome to the Session Based User Authentication project implemented in vanilla Node.js. This project demonstrates a robust and secure way to handle user authentication, manage sessions, and efficiently handle cookies.

## 📜 Project Description

This project provides a simple yet effective implementation of user authentication using sessions in a Node.js environment. The primary features include user registration, login, session management, password hashing, and various custom middlewares. It aims to offer a clear and practical example of building a secure authentication system without relying on frameworks like Express.

## ⚙️ Environment Variables

To configure the application, you need to set the following environment variables in your `.env` file:

- `MONGODB_URI`: Your MongoDB connection string.
- `HOST`: The host address where your application will run.
- `PORT`: The port on which your application will listen.

Default values are provided in the configuration file, but it's recommended to set your custom values for deployment.

## 🌟 Features

- **User Authentication**: Secure login and signup functionality with session-based authentication.
- **Session Management**: Efficiently creating and deleting user sessions, automatically handling session expiration.
- **Password Hashing**: Ensuring user passwords are stored securely using hashing techniques.
- **Custom Middlewares**:
  - `cookieParser`: Middleware to parse cookies from incoming requests.
  - `authMiddleware`: Middleware to protect routes by checking user authentication status.

## 📦 Installation

To get started with the project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/CodeBy-Ali/UserAuth-Vanilla-NodeJs.git
    cd UserAuth-Vanilla-NodeJs
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the application**:
    ```bash
    npm start
    ```

## 🚀 Usage

### User Registration

Send a `POST` request to `/signup` with the following JSON payload Or can submit through form:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}

```

### User Registration

Send a POST request to /login with the following JSON payload OR can submit through form:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

### Protected Routes

Use the `authMiddleware` to protect any route that requires authentication. For example:

```javascript
const authMiddleware = require('./middlewares/authMiddleware');

// Example of a protected route
app.get('/dashboard', authMiddleware, (req, res) => {
  res.send('Welcome to your dashboard!');
});
```

## 🛠️ Important Features

- **Custom Middlewares**: The project includes custom middlewares like `cookieParser` for parsing cookies and `authMiddleware` for protecting routes.
- **Automatic Session Deletion**: User sessions are automatically deleted from the database when they expire, ensuring efficient session management.
- **Secure Cookie Management**: Cookies are managed securely with appropriate flags (`HttpOnly`, `Secure`, `SameSite`) to protect against common web vulnerabilities.

## 🤝 Contributing

Contributions are welcome! If you have any improvements or suggestions, please feel free to open an issue or create a pull request.

## 🧭 Navigation
- My next project [SingUp Form](https://github.com/MAliHassanDev/login-and-signup-form-in-expressjs)
- My previous project [Breakout](https://github.com/MAliHassanDev/Break-Out-Game)