import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSignup from '../../hooks/useSignup';
import styles from './signup.module.css';
const projectLogo = "/assets/project_logo.png";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    mobileNumber: '', // Added mobileNumber field
  });

  const { loading, signup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.logoContainer}>
      <img src={projectLogo} alt="Project Logo" className={styles.logo} />
      </div>
      <div className={styles.groups}>
        <div className={styles.image2} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.home}>
            <h1 className={styles.heading}>Create Account</h1>
            <p className={styles.inputLabel}>Your name</p>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={`${styles.input} ${styles.inputBordered} h-10`}
                value={inputs.username}
                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
              />
            </div>
            <p className={styles.inputLabel}>Mobile number</p>
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={`${styles.input} ${styles.inputBordered} h-10`}
                value={inputs.mobileNumber}
                onChange={(e) => setInputs({ ...inputs, mobileNumber: e.target.value })}
              />
            </div>
            <p className={styles.inputLabel}>Email Id</p>
            <div className={styles.inputContainer}>
              <input
                type="email"
                className={`${styles.input} ${styles.inputBordered} h-10`}
                value={inputs.email}
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              />
            </div>
            <p className={styles.inputLabel}>Password</p>
            <div className={styles.inputContainer}>
              <input
                type="password"
                className={`${styles.input} ${styles.inputBordered} h-10`}
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              />
            </div>
 
            <div className={styles.buttonStack}>
            <p className={styles.noAccountText1}>

By enrolling your mobile phone number, you consent to receive automated security notifications via text message from Musicart. Message and data rates may apply.

</p>
              <button className={styles.btnBlock} disabled={loading}>
                {loading ? <span className={`${styles.loading} ${styles.loadingSpinner}`}></span> : "Continue"}
              </button>
              <p className={styles.noAccountText}>By continuing, you agree to Musicart privacy notice and conditions of use.</p>

            </div>
          </div>
        </form>
      </div>
      <div className={styles.registerLink}>
        <div className={styles.registerLinkContent}>
          <p className={styles.group1}>Already have an account? <Link to="/login" className={styles.link}>Sign in</Link></p>
          {loading && <span className={`${styles.loading} ${styles.loadingSpinner}`}></span>}
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Musicart | All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
