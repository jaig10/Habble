import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
// import Home from "./Home";
import Chatbot from "./Chatbot";
import Layout from "./Layout";
import LayoutWeb from "./LayoutWeb";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

export const App = () => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 1024;
  React.useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);
  const getToastStyle = () => {
    if (width < breakpoint) {
      return { width: "100%" };
    } else {
      return { width: "50%" };
    }
  };
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={getToastStyle()}
      />
      <Router>
        <Routes>
          <Route path="/chat" element={<Chatbot />} />
          <Route
            path="/"
            element={width < breakpoint ? <Layout /> : <LayoutWeb />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
