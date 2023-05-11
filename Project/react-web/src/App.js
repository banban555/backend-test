import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Application from "./pages/Application";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/application" element={<Application />}></Route>
      </Routes>
    </div>
  );
}

export default App;
