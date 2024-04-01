import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import HomeMobile from "./pages/home/HomeMobile";
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

import ProductDetailPageMobile from './pages/product/ProductDetailPageMobile';
import MycartMobile from "./pages/mycart/MycartMobile";
import CheckoutMobile from './pages/checkout/CheckoutMobile';
import OrderConfirmationMobile from "./pages/order/OrderConfirmationMobile";
import InvoicesMobile from './pages/invoices/InvoicesMobile';
import InvoiceDetailsMobile from './pages/invoices/InvoiceDetailsMobile';

function App() {
  const { authUser } = useAuthContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the window width is less than 768px
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Initial check
    checkIsMobile();

    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <div className="app">
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Navigate to="/home" /> : isMobile ? <HomeMobile /> : <Home />}
          />
          <Route
            path="/home"
            element={authUser ? (isMobile ? <HomeMobile /> : <Home />) : <Navigate to="/login" />}
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
            element={isMobile ? <ProductDetailPageMobile /> : <ProductDetailPage />}
          />
          <Route path="/mycart" element={isMobile ? <MycartMobile /> : <Mycart />} />
          <Route path="/checkout" element={isMobile ? <CheckoutMobile /> : <Checkout />} />
          <Route path="/OrderConfirmation" element={isMobile ? <OrderConfirmationMobile /> : <OrderConfirmation />} />
          <Route path="/Invoices" element={isMobile ? <InvoicesMobile /> : <Invoices />} />
          <Route path="/invoices/:invoiceId" element={isMobile ? <InvoiceDetailsMobile /> : <InvoiceDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
