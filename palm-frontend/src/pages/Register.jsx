import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../assets/css/style.css"; 
import signupImg from "../assets/images/signup-image.jpg";

  export default function Register() {
  const [form, setForm] = useState({first_name:'', last_name:'',username:'', email:'', password:''});
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();  // ← ADD THIS

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();

     let newErrors = {};

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    newErrors.email = "Please enter a valid email address.";
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(form.password)) {
    newErrors.password =
      "Password must be at least 8 characters, include uppercase, lowercase, and a digit.";
  }

  // Address validation (if entered)
  const addressRegex = /^[A-Za-z\s]+$/;
  if (address && !addressRegex.test(address)) {
    newErrors.address = "Address must contain only alphabets.";
  }

  // If any errors found
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
    try {
      const res = await api.post('register/', form);
      setMessage('Registration successful! Redirecting...');

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch(err){
      setMessage('Error: ' + err.response.data);
    }
  };

  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">

            {/* LEFT – FORM */}
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>

              <form className="register-form" id="register-form" onSubmit={handleSubmit}>

                {/* FIRST-NAME */}
                <div className="form-group">
                  <label htmlFor="username">
                    <i className="zmdi zmdi-face"></i>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* LAST - NAME */}
                <div className="form-group">
                  <label htmlFor="username">
                    <i className="zmdi zmdi-face"></i>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* USERNAME */}
                <div className="form-group">
                  <label htmlFor="username">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Your Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="zmdi zmdi-email"></i>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                {/* PASSWORD */}
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
                  {errors.password && <p className="error-text">{errors.password}</p>}
                </div>

                {/* ADDRESS */}
                <div className="form-group">
                  <label htmlFor="username">
                    <i className="zmdi zmdi-pin"></i>
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Please Enter Address(optional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  {errors.address && <p className="error-text">{errors.address}</p>}
                </div>

                {/* IS STAFF */}
                {/* <div className="form-group">
                  <input
                    type="checkbox"
                    name="is_staff"
                    id="is_staff"
                    checked={form.is_staff}
                    onChange={handleChange}
                  />
                  <label htmlFor="is_staff" className="label-agree-term" style={{ cursor: "pointer" }}>
                    <span><span></span></span>
                    Register as Staff
                  </label>
                </div> */}

                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    value="Register"
                  />
                </div>
              </form>

              <p>{message}</p>
            </div>

            {/* RIGHT – IMAGE */}
            <div className="signup-image">
              <figure>
                <img src={signupImg} alt="sign up" />
              </figure>
              <a href="/login" className="signup-image-link">
                I am already member
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
