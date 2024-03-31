import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home"; 
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import ProductDetailPage from './pages/product/ProductDetailPage';
import Mycart from "./pages/mycart/Mycart";
import Checkout from './pages/checkout/Checkout';
import OrderConfirmation from "./pages/order/OrderConfirmation";
import Invoices from './pages/invoices/Invoices';
import InvoiceDetails from './pages/invoices/InvoiceDetails';

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="app">
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Navigate to="/home" /> : <Home />}
          />
          <Route
            path="/home"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/product/ProductDetails/:productId"
            element={<ProductDetailPage />}
          />
          <Route path="/mycart" element={<Mycart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
          <Route path="/Invoices" element={<Invoices />} />
          <Route path="/invoices/:invoiceId" element={<InvoiceDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
