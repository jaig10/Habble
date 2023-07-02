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
  
  
  
    return (
      <>
      <Router>
        <Routes>
            <Route path='/chat' element={<Chatbot/>} />
            {/* <Route path='/' element={<LayoutWeb/>} /> */}
            <Route path='/' element={<Layout/>} />
            {/* <Route path='/testing' element={<Home/>} /> */}
        </Routes>
      </Router>
      </>
    )
  }
  
  export default App;
  