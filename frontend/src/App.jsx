import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard"; 
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import BoardPage from "./pages/board/BoardPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage"; 
import SettingsPage from "./pages/settings/SettingsPage"; 
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="app">
      <Dashboard/>
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              authUser ? ( <Dashboard /> ) : ( <Navigate to="/login" /> )
            }
          />
          <Route
            path="/login"
            element={
              authUser ? ( <Navigate to="/" /> ) : ( <Login /> )
            }
          />
          <Route
            path="/signup"
            element={
              authUser ? ( <Navigate to="/" /> ) : ( <SignUp /> )
            }
          />
          <Route
            path="/board"
            element={
              authUser ? ( <BoardPage username={authUser.username} /> ) : ( <Navigate to="/login" /> )
            }
          />
          <Route
            path="/analytics"
            element={
              authUser ? ( <AnalyticsPage username={authUser.username} /> ) : ( <Navigate to="/login" /> )
            }
          />
          <Route
            path="/settings"
            element={
              authUser ? ( <SettingsPage username={authUser.username} /> ) : ( <Navigate to="/login" /> )
            }
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
