import { Link } from "react-router-dom";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import userIcon from "/src/photo/icon.png";
import lockIcon from "/src/photo/lock.png";
import "./signup.css"; // Importing the CSS file


const SignUp = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
   
  });

  const { loading, signup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <div className='main-container'>
      <div className='image-container'>
        <div className='image'>
          <div className="centered-photo">
            <img src="/src/photo/Back.png" alt="Background" className="centered-back-image" />
            <img src="/src/photo/Art (1).png" alt="Centered Photo" />
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
          <h1 className='heading'>Register</h1>
          <div className='input-container'>
            <label className='label'>
            </label>
            <input
              type='text'
              placeholder='John Doe'
              className='w-full input input-bordered h-10'
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            />
            <span className="icon" style={{ backgroundImage: `url(${userIcon})` }}></span>
          </div>
          <div className='input-container'>
            <label className='label'>
            </label>
            <input
              type='email'
              placeholder='johndoe@g.com'
              className='w-full input input-bordered h-10'
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
            <span className="icon" style={{ backgroundImage: `url(${userIcon})` }}></span>
          </div>
          <div className='input-container'>
            <label className='label'>
            </label>
            <input
              type='password'
              placeholder='Enter Password'
              className='w-full input input-bordered h-10'
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
            <span className="icon" style={{ backgroundImage: `url(${lockIcon})` }}></span>
          </div>
          <div className='input-container'>
            <label className='label'>
            </label>
            <input
              type='password'
              placeholder='Confirm Password'
              className='w-full input input-bordered h-10'
              value={inputs.confirmPassword}
              onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
            />
            <span className="icon" style={{ backgroundImage: `url(${lockIcon})` }}></span>
          </div>
          <div className='button-stack'>
            <button className='btn-block' disabled={loading}>
              {loading ? <span className='loading loading-spinner'></span> : "Register"}
            </button>
            <p className="no-account-text">Already have an account?</p>
            <div className='register-link'>
			<button className='login-button' disabled={loading}>
    {loading ? <span className='loading loading-spinner'></span> : "Login"}
</button>            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
