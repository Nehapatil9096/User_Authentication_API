import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ username, email, password, mobileNumber }) => {
    const success = handleInputErrors({ username, email, password, mobileNumber });
    if (!success) return;
    setLoading(true);
    try {
      console.log(username, email, password, mobileNumber);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, mobileNumber }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputErrors({ username, email, password, mobileNumber }) {
  if (!username || !email || !password || !mobileNumber) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }
  if (mobileNumber.length < 10) {
    toast.error("Mobile number must be at least 10 digits");
    return false;
  }
  // Add additional validation rules for mobile number if needed

  return true;
}
