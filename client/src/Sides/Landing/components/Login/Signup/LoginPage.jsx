import React from "react";
import "./LoginPage.css";
import Login from "../../../../../assets/Login.png"; // Adjust the path as needed

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="image-section">
          <img
            src={Login} // Using the imported image
            alt="Illustration"
            className="illustration"
          />
        </div>
        <div className="card-content">
          <h2>Welcome Back to AlumnLink!</h2>
          <button className="google-login">Continue with Google</button>
          <button className="linkedin-login">Login with LinkedIn</button>
          <div className="divider">Or login with email</div>
          <form className="login-form">
            <input type="email" placeholder="Email Id" required />
            <input type="password" placeholder="Enter Your Password" required />
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="signup-text">
            Don't have an account? <a href="/">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
