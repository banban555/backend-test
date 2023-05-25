import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./style/GlobalStyle";
import theme from "./style/theme";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Application from "./pages/Application";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<SignIn />}></Route>
          <Route path="signin/" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/application" element={<Application />}></Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
