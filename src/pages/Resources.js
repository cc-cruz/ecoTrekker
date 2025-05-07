import * as React from "react";
import Navbar from "../components/navbar.js";
import "./resources.css";

function Resources() {
    return (
        <div className="App">
            <Navbar />
            <div className="credit-attribution">
                <h2>Credits & Attribution:</h2>
                <h3>Website Development</h3>
                <ul>
                    <li>
                        <strong>Developers:</strong> Carson, Geoff, Jennifer, Paula
                    </li>
                    <li>
                        <strong>Tools:</strong> VSCode, Github
                    </li>
                </ul>
                <h3>Libraries and Frameworks: </h3>
                <ul>
                    <li>React</li>
                    <li>MapLibreGL</li>
                    <li>MapTiler</li>
                    <li>PMTiles</li>
                </ul>
                <h3>Content:</h3>
                <ul>
                    <li>
                        Data Sources:{" "}
                        <a href="https://data.ca.gov/dataset/california-high-hazard-zones-tier-1">
                            https://data.ca.gov/dataset/california-high-hazard-zones-tier-1
                        </a>
                    </li>
                    <li>
                        <strong>Icon Attribution: </strong>
                        <a href="https://www.vecteezy.com/free-vector/earth">
                            Earth Vectors by Vecteezy
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Resources;
