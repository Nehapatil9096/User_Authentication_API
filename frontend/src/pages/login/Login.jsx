import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./login.module.css";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { loading, login } = useLogin();
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await login(identifier, password);
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }, 500);
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  return (
    <div className={styles.mainContainer}>
      <div>
        <div className={styles.logoContainer}>
          {/* You can add your logo here */}
        </div>
        
        <h1 className={styles.headingmob}>Welcome Back</h1>
        
        <div className={styles.groups}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.home}>
              <h1 className={styles.heading}>
                Sign in <span className={styles.alreadyCustomerText}>Already a user?</span>
              </h1>
              
              <p className={styles.inputLabel}>Enter your email</p>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  className={`${styles.input} ${styles.inputBordered}`}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email"
                />
              </div>
              
              <p className={styles.inputLabel}>Password</p>
              <div className={styles.inputContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className={`${styles.input} ${styles.inputBordered}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>
              
              <div className={styles.buttonStack}>
                <button 
                  type="submit" 
                  className={styles.btnBlock} 
                  disabled={loading || !identifier || !password}
                >
                  {loading ? (
                    <>
                      <span className={`${styles.loading} ${styles.loadingSpinner}`}></span>
                      Signing in...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className={styles.lineContainer}>
          <div className={styles.lineImage1}></div>
          <p className={styles.newToMusicart}>Don't have an account?</p>
          <div className={styles.lineImage1}></div>
        </div>
        
        <div className={styles.registerLink}>
          <Link to="/signup" className={styles.Link1}>
            <button className={styles.btnBlock1}>Create your account</button>
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default Login;