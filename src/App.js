import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes
  } from "react-router-dom";
// import Home from "./Home";
import Chatbot from "./Chatbot";
import Layout from "./Layout";
import LayoutWeb from "./LayoutWeb";
import './App.css'

  
  
  export const App = () => {
  
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint = 1024;
    React.useEffect(() => {
      window.addEventListener("resize", () => setWidth(window.innerWidth));
    }, []);
  
    return (
      <>
      <Router>
        <Routes>
            <Route path='/chat' element={<Chatbot/>} />
            {/* <Route path='/' element={<LayoutWeb/>} /> */}
            {/* <Route path='/' element={<Layout/>} /> */}
            <Route path='/' element={width < breakpoint ? <Layout /> : <LayoutWeb />} />
            {/* <Route path='/testing' element={<Home/>} /> */}
        </Routes>
      </Router>
      </>
    )
  }
  
  export default App;
  