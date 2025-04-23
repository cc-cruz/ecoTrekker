import * as React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Resources from "./Resources";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            {/* <Route path="*" element={<NotFound />} />  catch-all for 404s */}
        </Routes>
    );
}

export default App;
