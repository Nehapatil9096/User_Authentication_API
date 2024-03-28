import { Link } from "react-router-dom";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import projectLogo from '/project_logo.png';
import styles from "./signup.module.css"; // Adjust the path as per your project structure

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
   <div className={styles.mainContainer}>
      <div className={styles.logoContainer}>
      <img src={projectLogo} alt="Project Logo" className={styles.logo} /> {/* Use styles object */}
      </div>
      <div className={styles.groups}>
        <div className={styles.image2} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.heading}>Create Account</h1>
          <p className={styles.inputLabel}>Your name</p>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Name"
              className={`${styles.input} ${styles.inputBordered} h-10`}
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            />
          </div>
          <p className={styles.inputLabel}>Mobile number</p>
          <div className={styles.inputContainer}>
            <input
              type="email"
              placeholder="Email"
              className={`${styles.input} ${styles.inputBordered} h-10`}
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </div>
          <p className={styles.inputLabel}>Email Id</p>
          <div className={styles.inputContainer}>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              className={`${styles.input} ${styles.inputBordered} h-10`}
              value={inputs.confirmPassword}
              onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
            />
          </div>
          <p className={styles.inputLabel}>Password</p>
          <div className={styles.inputContainer}>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className={`${styles.input} ${styles.inputBordered} h-10`}
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
          </div>
          <div className={styles.buttonStack}>
            <p className={styles.noAccountText}>
              By enrolling your mobile phone number, you consent to receive automated security notifications via text message from Musicart. Message and data rates may apply.
            </p>
            <button className={styles.btnBlock} disabled={loading}>
              {loading ? <span className={`${styles.loading} ${styles.loadingSpinner}`}></span> : "Continue"}
            </button>
            <p>By continuing, you agree to Musicart privacy notice and conditions of use.</p>
          </div>
        </form>
      </div>
      <div className={styles.registerLink}>
        <div className={styles.group}>
          <Link to="/login">
          <div className='register-link'>
  <div className="group">
    <p>Already have an account? <Link to="/login" className={styles.link}>Login</Link></p>
    {loading && <span className={`${styles.loading} ${styles.loadingSpinner}`}></span>}
  </div>
</div>

          </Link>
        </div>
      </div>
      <footer className={styles.footer}> {/* Use styles object */}
      <div className={styles.footerContent}> {/* Use styles object */}
        <span>Musicart | All rights reserved</span>
      </div>
    </footer>
    </div>
  );
};

export default SignUp;