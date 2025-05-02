import * as React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="*" element={<NotFound />} />  catch-all for 404s */}
        </Routes>
    );
}

export default App;
