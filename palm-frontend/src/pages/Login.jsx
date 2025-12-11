import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/style.css";
import signinImage from "../assets/images/signin-image.jpg"; 
import api from "../api";

export default function Login({ setUser }) {

  const [form, setForm] = useState({ username: "", password: "" });
  const [remember, setRemember] = useState(false);      //  <-- added
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post(
      "login/",
      {
        username: form.username,
        password: form.password,
        remember: remember
      },
      { withCredentials: true }
    );

    // FIX: Extract user object only
    const userData = res.data;

    // Set user in React
    setUser(userData);

    // Store in browser
    if (remember) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
    }

    setMessage("Login successful!");
    navigate("/dashboard");

  } catch (err) {
    setMessage("Invalid credentials");
    console.error(err);
  }
};

  return (
    <div className="main">
      <section className="sign-in">
        <div className="container">
          <div className="signin-content">

            {/* Left Image */}
            <div className="signin-image">
              <figure>
                <img src={signinImage} alt="sign in" />
              </figure>
              <Link to="/register" className="signup-image-link">
                Create an account
              </Link>
            </div>

            {/* Right Form */}
            <div className="signin-form">
              <h2 className="form-title">Sign In</h2>

              <form onSubmit={handleSubmit} className="register-form" id="login-form">

                <div className="form-group">
                  <label htmlFor="username">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Your Name"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <i className="zmdi zmdi-lock"></i>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* REMEMBER ME */}
                <div className="form-group">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="agree-term"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    style={{ cursor: "pointer" }}
                  />
                  <label htmlFor="remember-me" className="label-agree-term">
                    <span><span></span></span> Remember me
                  </label>
                </div>

                <div className="form-group form-button">
                  <input
                    type="submit"
                    id="signin"
                    className="form-submit"
                    value="Log In"
                  />
                </div>

              </form>

              <p style={{ color: "red", marginTop: "10px" }}>{message}</p>

              <div className="social-login">
                <span className="social-label">Or login with</span>
                <ul className="socials">
                  <li><a href="#"><i className="display-flex-center zmdi zmdi-facebook"></i></a></li>
                  <li><a href="#"><i className="display-flex-center zmdi zmdi-twitter"></i></a></li>
                  <li><a href="#"><i className="display-flex-center zmdi zmdi-google"></i></a></li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
