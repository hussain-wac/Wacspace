// App.jsx
import React from "react";
import { Provider } from "jotai";
import { useAtomValue } from "jotai";
import { globalState } from "./jotai/globalState";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Schedule from "./components/Schedule";
import MainLayout from "./components/MainLayout";
import { Toaster } from "@/components/ui/sonner";
import useFavicon from "./useFavicon";

function App() {
  const user = useAtomValue(globalState);
  useFavicon();
  return (
    <Provider>
       <head>
       <title>WACspace</title>
        <link id="favicon" rel="icon" type="image/png" href="/favicon-light.png" />
      </head>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
