import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecruiterAuthModal = ({ onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = isSignup
        ? await axios.post(`${backendUrl}/api/companies/register`, formData) // Register Recruiter
        : await axios.post(`${backendUrl}/api/companies/login`, formData); // Login Recruiter

      if (response.status === 200 || response.status === 201) {
        const { token } = response.data;
        localStorage.setItem("recruiterToken", token); // Store recruiter token

        setMessage("Authentication successful.");
        if (token) {
            setTimeout(() => {
              navigate("/company-dashboard"); // Redirect to company-dashboard route
            }, 1000); // Delay the redirect for a better user experience
          } else {
            setTimeout(() => onClose(), 1000); // Close modal if no token
          }
      } else {
        setMessage(response.data.message || "Authentication failed.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <button className="text-gray-500 float-right" onClick={onClose}>❌</button>
        <h2 className="text-xl font-bold text-center">
          Recruiter {isSignup ? "Signup" : "Login"}
        </h2>
        {message && <p className="text-center text-sm text-red-500">{message}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Company Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded mt-4">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="text-center mt-2 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RecruiterAuthModal;
