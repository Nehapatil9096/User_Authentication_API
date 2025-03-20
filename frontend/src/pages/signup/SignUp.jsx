import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../../hooks/useSignup";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./signup.module.css";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    mobileNumber: "",
    role: "user",
  });

  const { loading, signup, errors, validateInputs, isFormValid } = useSignup();
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  // Handle input change & validate in real time
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    validateInputs(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }, 1000); //  Ensures authentication is set before redirecting
  };
  

  return (
    <div className={styles.mainContainer}>
      <div className={styles.groups}>
        <div className={styles.image2} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.home}>
            <h1 className={styles.heading}>Create Account</h1>

            {/* Username */}
            <p className={styles.inputLabel}>Your Name</p>
            <input
              type="text"
              name="username"
              className={`${styles.input} ${styles.inputBordered} h-10`}
              value={inputs.username}
              onChange={handleChange}
              placeholder="Username (Min 3 characters)"
            />
            {errors.username && <p className={styles.errorText}>{errors.username}</p>}

            {/* Mobile Number */}
            <p className={styles.inputLabel}>Mobile Number</p>
            <input
              type="text"
              name="mobileNumber"
              className={`${styles.input} ${styles.inputBordered} h-10`}
              value={inputs.mobileNumber}
              onChange={handleChange}
              placeholder="10+ digit mobile number"
            />
            {errors.mobileNumber && <p className={styles.errorText}>{errors.mobileNumber}</p>}

            {/* Email */}
            <p className={styles.inputLabel}>Email ID</p>
            <input
              type="email"
              name="email"
              className={`${styles.input} ${styles.inputBordered} h-10`}
              value={inputs.email}
              onChange={handleChange}
              placeholder="Valid email address"
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}

            {/* Password */}
            <p className={styles.inputLabel}>Password</p>
            <input
              type="password"
              name="password"
              className={`${styles.input} ${styles.inputBordered} h-10`}
              value={inputs.password}
              onChange={handleChange}
              placeholder="8+ characters, 1 uppercase, 1 number, 1 special character"
            />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}

            {/* Role Selection */}
            <p className={styles.inputLabel}>Select Role</p>
            <select
              name="role"
              className={`${styles.input} ${styles.inputBordered} h-10`}
              value={inputs.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Continue Button (Disabled if Form is Invalid) */}
            <div className={styles.buttonStack}>
              <button className={styles.btnBlock} disabled={!isFormValid || loading}>
                {loading ? <span className={`${styles.loading} ${styles.loadingSpinner}`}></span> : "Continue"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Already have an account? */}
      <div className={styles.registerLink}>
        <p className={styles.group1}>
          Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
