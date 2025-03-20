import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  //  State for errors
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  // Function to validate fields while typing
  const validateInputs = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "username":
        if (!value || value.length < 3) {
          errorMsg = "Username must be at least 3 characters.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          errorMsg = "Please enter a valid email address.";
        }
        break;
      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!value || !passwordRegex.test(value)) {
          errorMsg =
            "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";
        }
        break;
      case "mobileNumber":
        const mobileRegex = /^[0-9]{10,}$/;
        if (!value || !mobileRegex.test(value)) {
          errorMsg = "Mobile number must be at least 10 digits.";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  //  Check if all fields are valid
  const isFormValid = Object.values(errors).every((err) => err === "") &&
    Object.values(errors).length > 0;

  const signup = async ({ username, email, password, mobileNumber, role = "user" }) => {
    if (!isFormValid) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, mobileNumber, role }),
        credentials: "include", // Ensures JWT cookie is set
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      //  Store user details in local storage
      localStorage.setItem("user", JSON.stringify(data));

      //  Immediately update authUser state
      setAuthUser(data);

      toast.success(`Account created! Welcome, ${data.username}! Role: ${data.role}`);

      //  Force page reload to ensure authentication and token sync
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  return { loading, signup, errors, validateInputs, isFormValid };
};

export default useSignup;
