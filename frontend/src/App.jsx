import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import AdminDashboard from "./pages/admin/AdminDashboard"; //  Import Admin Dashboard
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser, role } = useAuthContext(); //  Get role from context

  return (
    <div className="app">
      <div className="main-content">
        <Routes>
          {/* Redirect based on role */}
          <Route
            path="/"
            element={
              authUser ? (
                role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/home" />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/home"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          {authUser && role === "admin" && <Route path="/admin" element={<AdminDashboard />} />}

          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
