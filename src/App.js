import {
    BrowserRouter as Router,
    Route,
    Routes
  } from "react-router-dom";
// import Home from "./Home";
// import Chatbot from "./Chatbot";
import Layout from "./Layout";
import LayoutWeb from "./LayoutWeb";

  
  
  export const App = () => {
  
  
  
    return (
      <>
      <Router>
        <Routes>
            {/* <Route path='/' element={<Chatbot/>} /> */}
            <Route path='/' element={<LayoutWeb/>} />
            {/* <Route path='/' element={<Layout/>} /> */}
            {/* <Route path='/testing' element={<Home/>} /> */}
        </Routes>
      </Router>
      </>
    )
  }
  
  export default App;
  