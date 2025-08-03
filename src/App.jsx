// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import NavbarWithSidebar from "./component/ui/Navbar";

function App() {
  return (
    <Router>
      
        <NavbarWithSidebar />
      
    </Router>
  );
}

export default App;
