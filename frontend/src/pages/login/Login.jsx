import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import "./login.css"; // Importing the CSS file
import userIcon from "/src/photo/icon.png";
import lockIcon from "/src/photo/lock.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    await login(email, password);
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
          <h1 className='heading'>Login</h1>
          <div className='input-container'>
            <label className='label'>
              <span className='text-base label-text'></span>
            </label>
            <input
              type='text'
              placeholder='Enter email'
              className='w-full input input-bordered h-10'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="icon" style={{ backgroundImage: `url(${userIcon})` }}></span>
          </div>
          <div className='input-container'>
            <label className='label'>
              <span className='text-base label-text'></span>
            </label>
            <img src={lockIcon} alt="Lock Icon" className="icon" />
            <input
              type='password'
              placeholder='Enter Password'
              className='w-full input input-bordered h-10'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img src="/src/photo/view.png" alt="Password View Icon" className="icon password" />
          </div>
          <div className='button-stack'>
            <button className='btn-block' disabled={loading}>
              {loading ? <span className='loading loading-spinner'></span> : "Login"}
            </button>
            <p className="no-account-text">Don't have an account yet?</p>
            <div className='register-link'>
              <Link to='/signup' className='text-sm hover:underline hover:text-blue-600'>
                <button className="register-button">Register</button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
