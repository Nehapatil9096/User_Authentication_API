import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import "./login.css";
import userIcon from "/icon.png";
import lockIcon from "/lock.png";
import viewIcon from "/view.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();
  const [passwordVisible, setPasswordVisible] = useState(false); // State to track password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    await login(email, password);
  };
   
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div className="main-container">
      <div className="image-container">
        <div className="image">
          <div className="centered-photo">
            <img
              src="/Back.png"
              alt="Background"
              className="centered-back-image"
            />
            <img src="/Art (1).png" alt="Centered Photo" />
            <div className="text-container">
              <h2 className="welcome-text">Welcome aboard my friend</h2>
              <p className="instructions">Just a couple of clicks and we start</p>
            </div>
          </div>
        </div>
      </div>
      <div className="groups">
        <form onSubmit={handleSubmit} className="form">
        <h1 className="heading mb-10">Login</h1>
          <div className="input-container">
            <span
              className="icon"
              style={{ backgroundImage: `url(${userIcon})` }}
            ></span>
            <input
              type="text"
              placeholder="Enter email"
              className="input input-bordered h-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <span className="icon" style={{ backgroundImage: `url(${lockIcon})` }}></span>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              className="input input-bordered h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={viewIcon}
              alt="Password View Icon"
              className="icon password"
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className="button-stack">
            <button className="btn-block" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Login"}
            </button>
            <p className="no-account-text">Don't have an account yet?</p>
            <div className="register-link">
              <Link
                to="/signup"
                className="text-sm hover:underline hover:text-blue-600"
              >
                <button className="btn-block">Register</button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
