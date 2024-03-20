import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home"; 
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import ProductDetailPage from './pages/product/ProductDetailPage'; // Import the ProductDetailPage component
import Mycart from "./pages/mycart/Mycart"; // Import the Checkout component

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="app">
      <div className="main-content">
      <Routes>
  <Route path="/" element={authUser ? (<Home />) : (<Navigate to="/login" />)}>
    {/* Nested routes within Home */}
  </Route>
  <Route path="/login" element={authUser ? (<Navigate to="/" />) : (<Login />)} />
  <Route path="/signup" element={authUser ? (<Navigate to="/" />) : (<SignUp />)} />
  <Route path="/product/ProductDetails/:productId" element={<ProductDetailPage />} />
  <Route path="/mycart" element={<Mycart />} /> {/* Add route for the checkout page */}

</Routes>

      </div>
      <Toaster />
    </div>
  );
}

export default App;
