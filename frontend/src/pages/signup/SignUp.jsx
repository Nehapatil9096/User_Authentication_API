import { Link } from "react-router-dom";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import userIcon from "/icon.png";
import lockIcon from "/lock.png";
import viewIcon from "/view.png";

import "./signup.css"; // Importing the CSS file


const SignUp = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
   
  });

  const { loading, signup } = useSignup();
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  return (
    <div className='main-container'>
      <div className='image-container'>
        <div className='image'>
          <div className="centered-photo">
            <img src="/Back.png" alt="Background" className="centered-back-image" />
            <img src="/Art (1).png" alt="Centered Photo" />
            <div className="text-container">
              <h2 className="welcome-text">Welcome aboard my friend</h2>
              <p className="instructions">Just a couple of clicks and we start</p>
            </div>
          </div>
        </div>
      </div>
      <div className='groups'>
        <div className='image-2' />
        <form onSubmit={handleSubmit} className='form'>
        <h1 className="heading mb-10">Register</h1> {/* Added margin-bottom class */}
          <div className='input-container'>
            
            <input
              type='text'
              placeholder='Name'
              className='w-full input input-bordered h-10'
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            />
            <span className="icon" style={{ backgroundImage: `url(${userIcon})` }}></span>
          </div>
          <div className='input-container'>
            
            <input
              type='email'
              placeholder='Email'
              className='w-full input input-bordered h-10'
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
            <span className="icon" style={{ backgroundImage: `url(${userIcon})` }}></span>
          </div>
          <div className="input-container">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full input input-bordered h-10"
              value={inputs.confirmPassword}
              onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
            />
            <span className="icon" style={{ backgroundImage: `url(${lockIcon})` }}></span>
            <img
              src={viewIcon}
              alt="Password View Icon"
              className="icon password"
              onClick={toggleConfirmPasswordVisibility}
            />
          </div>
          <div className="input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full input input-bordered h-10"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
            <span className="icon" style={{ backgroundImage: `url(${lockIcon})` }}></span>
            <img
              src={viewIcon}
              alt="Password View Icon"
              className="icon password"
              onClick={togglePasswordVisibility}
            />

          </div>
          <div className='button-stack'>
            <button className='btn-block' disabled={loading}>
              {loading ? <span className='loading loading-spinner'></span> : "Register"}
            </button>
            <p className="no-account-text">Already have an account?</p>
            <div className='register-link'>
            <Link to="/login">
          <button className='btn-block' disabled={loading}>
            {loading ? <span className='loading loading-spinner'></span> : "Login"}
          </button>
        </Link>          
        </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
