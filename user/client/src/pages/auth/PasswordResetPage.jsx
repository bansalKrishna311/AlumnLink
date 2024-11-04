import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PasswordResetPage = () => {
    const { token } = useParams(); // Get token from URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Call the backend API
            const response = await axios.post(
                `http://localhost:5000/api/v1/auth/reset-password/${token}`,
                { password }
            );
            setMessage(response.data.message);
            setError("");
            
            // Redirect to login after a successful password reset
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
                    />
                </div>
                <button type="submit" style={{ width: "100%", padding: "10px", borderRadius: "5px", background: "#007bff", color: "#fff" }}>
                    Reset Password
                </button>
            </form>
            {message && <p style={{ color: "green", marginTop: "15px" }}>{message}</p>}
            {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
        </div>
    );
};

export default PasswordResetPage;
