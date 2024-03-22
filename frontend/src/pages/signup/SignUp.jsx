import { Link } from "react-router-dom";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import projectLogo from '/project_logo.png';


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
 <div className="logo-container">
        <img src={projectLogo} alt="Project Logo" />
      </div>
      <div className='groups'>
        <div className='image-2' />
        <form onSubmit={handleSubmit} className='form'>
        <h1 className="heading mb-10">Create Account</h1> {/* Added margin-bottom class */}
        <p className="input-label">Your name</p>

          <div className='input-container'>
            <input
              type='text'
              placeholder='Name'
              className='w-full input input-bordered h-10'
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            />
          </div>
          <p className="input-label">Mobile number</p>

          <div className='input-container'>
            
            <input
              type='email'
              placeholder='Email'
              className='w-full input input-bordered h-10'
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </div>
          <p className="input-label">Email Id</p>

          <div className="input-container">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full input input-bordered h-10"
              value={inputs.confirmPassword}
              onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
            />
            
          </div>
          <p className="input-label">Password</p>

          <div className="input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full input input-bordered h-10"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
           

          </div>
          <div className='button-stack'>
          <p className="no-account-text">By enrolling your mobile phone number, you consent to receive automated security notifications via text message from Musicart. Message and data rates may apply.
</p>
            <button className='btn-block' disabled={loading}>
              {loading ? <span className='loading loading-spinner'></span> : "Continue"}
            </button>
            
          <p> By continuing, you agree to Musicart privacy notice and conditions of use.</p> 
          </div>
        </form>
      </div>
      <div className='register-link'>
        <div className="group">
            <Link to="/login">
              
          <button className='btn-block' disabled={loading}>             

            {loading ? <span className='loading loading-spinner'></span> : "Login"}
          </button>
          <p>Already have an account? </p>

        </Link>          
        </div>
        </div>
        <div className='bottomBar'>
        Musicart | All rights reserved
      </div>
    </div>
  );
};


export default SignUp;
