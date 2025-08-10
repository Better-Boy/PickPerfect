"use client";

import { useState, useEffect } from "react";
import { login, register } from "../utils/api";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Signup state
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    latitude: -1,
    longitude: -1,
  });
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [locationFetched, setLocationFetched] = useState(false);

  // Fetch geolocation when switching to signup tab
  useEffect(() => {
    if (activeTab === "signup") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setSignupData((prev) => ({
              ...prev,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }));
            setLocationFetched(true);
          },
          () => {
            setSignupError("You must allow location access to sign up.");
          }
        );
      } else {
        setSignupError("Geolocation is not supported by your browser.");
      }
    }
  }, [activeTab]);

  // Handle form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Login submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await login(loginData.email, loginData.password);
      console.log("Login successful");
      onClose();
    } catch (err: any) {
      console.log(err);
      setLoginError(err.response?.data?.detail || "Login failed");
    }
  };

  // Signup submit
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    try {
      await register(signupData.fullName, signupData.email, signupData.password, signupData.latitude, signupData.longitude);
      setSignupSuccess("Signup successful! Please log in.");
      setActiveTab("login");
    } catch (err: any) {
      console.log(err);
      setSignupError(err.response?.data?.detail || "Signup failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          ✕
        </button>

        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button
            className={`flex-1 p-2 ${activeTab === "login" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 p-2 ${activeTab === "signup" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Success message after signup */}
        {activeTab === "login" && signupSuccess && (
          <p className="text-green-600 text-sm mb-3">{signupSuccess}</p>
        )}

        {/* Login form */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            {loginError && <p className="text-red-500 text-sm mb-2">{loginError}</p>}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full p-2 rounded text-white bg-blue-500 hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        )}

        {/* Signup form */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignup}>
            {signupError && <p className="text-red-500 text-sm mb-2">{signupError}</p>}
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={signupData.fullName}
              onChange={handleSignupChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            {/* Hidden fields for lat/lon */}
            <input type="hidden" name="latitude" value={signupData.latitude} />
            <input type="hidden" name="longitude" value={signupData.longitude} />


            <button
              type="submit"
              className={`w-full p-2 rounded text-white ${
                locationFetched ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"
              }`}
              disabled={!locationFetched}
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
