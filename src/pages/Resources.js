import * as React from "react";
import Navbar from "../components/navbar.js";

function Resources() {
    return (
        <div className="App">
            <Navbar />
            <h2>Credits:</h2>
            <p>MapLibreGL</p>
            <p>OpenStreetMap</p>
            <p>
                Data:{" "}
                <a href="https://www.fema.gov/disaster/4856/designated-areas ">
                    https://www.fema.gov/disaster/4856/designated-areas{" "}
                </a>{" "}
            </p>
            <p>
                Icon Attribution:{" "}
                <a href="https://www.vecteezy.com/free-vector/earth">Earth Vectors by Vecteezy</a>
            </p>
        </div>
    );
}

export default Resources;
