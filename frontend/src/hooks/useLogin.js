import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (identifier, password) => {
    const success = handleInputErrors(identifier, password);
    if (!success) return;

    setLoading(true);
    console.log(identifier, password);

    try {
      const res = await fetch("/api/auth/login", { // Use absolute URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
        credentials: "include", // Ensures cookies (JWT) are sent
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      //  Store role in localStorage and update context
      document.cookie = `jwt=${data.token}; path=/;`;  // Store JWT in cookies
      localStorage.setItem("user", JSON.stringify(data)); // Store user info
            setAuthUser(data);

      toast.success(`Welcome, ${data.username}! Role: ${data.role}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors(identifier, password) {
  if (!identifier || !password) {
    toast.error("Please fill in all fields");
    return false;
  }
  return true;
}
