import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import "./login.css";
import projectLogo from '/project_logo.png';

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
     <div className="logo-container">
        <img src={projectLogo} alt="Project Logo" />
      </div>
      <div className="groups">
        <form onSubmit={handleSubmit} className="form">
        <h1 className="heading mb-10">Sign in </h1>
        <p className="input-label">Enter your email or mobile number</p>

          <div className="input-container">

            <input
              type="text"
              className="input input-bordered h-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <p className="input-label">Password</p>

          <div className="input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              className="input input-bordered h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
           
          </div>
          <div className="button-stack">
            <button className="btn-block" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Continue"}
            </button>
            <p className="no-account-text">By continuing, you agree to Musicart privacy notice and conditions of use.</p>
           
          </div>
        </form>
      </div>
   <p> ━━━━━━━━━━━━━━━━━━━━━━━━━New to Musicart?         ━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
      <div className="register-link">
              <Link
                to="/signup"
                className="text-sm hover:underline hover:text-blue-600"
              >
                <button className="btn-block">Create your Musicart account</button>
              </Link>
            </div>
            <div className='bottomBar'>
        Musicart | All rights reserved
      </div>
    </div>
  );
};

export default Login;
