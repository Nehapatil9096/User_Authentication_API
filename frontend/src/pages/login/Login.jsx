import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import projectLogo from '/project_logo.png';
import styles from "./login.module.css";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Changed from email to identifier
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Identifier:", identifier); // Changed from email to identifier
    console.log("Password:", password);
    await login(identifier, password); // Changed from email to identifier
  };
   
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={styles.mainContainer}>
      <div>
        <div className={styles.logoContainer}>
          <img src={projectLogo} alt="Project Logo" className={styles.logo} />
        </div>
        <h1 className={`${styles.headingmob} mb-10`}>Welcome</h1>

        <div className={styles.groups}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.home}>

              <h1 className={`${styles.heading} mb-10`}>Sign in <span className={styles.alreadyCustomerText}>Already a customer?</span></h1>
              <p className={styles.inputLabel}>Enter your email or mobile number</p>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  className={`${styles.input} ${styles.inputBordered} h-10`}
                  value={identifier} // Changed from email to identifier
                  onChange={(e) => setIdentifier(e.target.value)} // Changed from setEmail to setIdentifier
                />
              </div>
              <p className={styles.inputLabel}>Password</p>
              <div className={styles.inputContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className={`${styles.input} ${styles.inputBordered} h-10`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles.buttonStack}>
                <button className={styles.btnBlock} disabled={loading}>
                  {loading ? <span className={`${styles.loading} ${styles.loadingSpinner}`}></span> : "Continue"}
                </button>
                <p className={styles.noAccountText}>By continuing, you agree to Musicart privacy notice and conditions of use.</p>
              </div>
            </div>
          </form>
        </div>
        <div className={styles.lineContainer}>
          <img src="/line.png" alt="Line" className={styles.lineImage1} />
          <p className={styles.newToMusicart}>New to Musicart?</p>
          <img src="/line.png" alt="Line" className={styles.lineImage1} />
        </div>
        <div className={styles.registerLink}>
          <Link to="/signup" className={styles.Link1}>
            <button className={styles.btnBlock1}>Create your Musicart account</button>
          </Link>
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

export default Login;
