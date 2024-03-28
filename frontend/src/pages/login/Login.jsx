import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import projectLogo from '/project_logo.png';
import styles from "./login.module.css"; // Adjust the path as per your project structure


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
    <div className={styles.mainContainer}> {/* Use styles object */}
    <div>
    <div className={styles.logoContainer}> {/* Use styles object */}
      <img src={projectLogo} alt="Project Logo" className={styles.logo} /> {/* Use styles object */}
    </div>

    <div className={styles.groups}> {/* Use styles object */}
      <form onSubmit={handleSubmit} className={styles.form}> {/* Use styles object */}
      <div className={styles.home}> {/* Use styles object */}

        <h1 className={`${styles.heading} mb-10`}>Sign in</h1> {/* Use styles object */}
        <p className={styles.inputLabel}>Enter your email or mobile number</p> {/* Use styles object */}
        <div className={styles.inputContainer}> {/* Use styles object */}
        <input
  type="text"
  className={`${styles.input} ${styles.inputBordered} h-10`} // Use styles object
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

        </div>
        <p className={styles.inputLabel}>Password</p> {/* Use styles object */}
        <div className={styles.inputContainer}> {/* Use styles object */}
        <input
  type={passwordVisible ? "text" : "password"}
  className={`${styles.input} ${styles.inputBordered} h-10`} // Use styles object
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

        </div>
        <div className={styles.buttonStack}> {/* Use styles object */}
          <button className={styles.btnBlock} disabled={loading}> {/* Use styles object */}
            {loading ? <span className={`${styles.loading} ${styles.loadingSpinner}`}></span> : "Continue"}
          </button>
          <p className={styles.noAccountText}>By continuing, you agree to Musicart privacy notice and conditions of use.</p> {/* Use styles object */}
        </div>
        </div>

      </form>
    </div>
    <div className={styles.lineContainer}>
  <img src="/line.png" alt="Line" className={styles.lineImage1} />
  <p className={styles.newToMusicart}>New to Musicart?</p>
  <img src="/line.png" alt="Line" className={styles.lineImage1} />
</div>
    <div className={styles.registerLink}> {/* Use styles object */}
      <Link to="/signup" > {/* Use styles object */}
        <button className={styles.btnBlock1}>Create your Musicart account</button> {/* Use styles object */}
      </Link>
    </div>
    
  </div>
  {/* Footer */}
  <footer className={styles.footer}> {/* Use styles object */}
      <div className={styles.footerContent}> {/* Use styles object */}
        <span>Musicart | All rights reserved</span>
      </div>
    </footer>
  </div>
);
};

export default Login;