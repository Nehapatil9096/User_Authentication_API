import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (identifier, password) => { // Changed parameter name from email to identifier
    const success = handleInputErrors(identifier, password); // Changed parameter name from email to identifier
    if (!success) return;
    setLoading(true);
    console.log(identifier, password);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }), // Changed parameter name from email to identifier
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

  return { loading, login };
};

export default useLogin;

function handleInputErrors(identifier, password) { // Changed parameter name from email to identifier
  if (!identifier || !password) { // Changed parameter name from email to identifier
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}
