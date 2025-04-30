import * as React from "react";
import { useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import Navbar from "./components/navbar.js";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import SearchBar from "./SearchBar";

function App() {
    const [searchText, setSearchText] = useState("");
    const [mapCoords, setMapCoords] = useState({
        longitude: -120.133,
        latitude: 38,
    });
    const mapZoom = 5.3;
    const mapRef = React.useRef();

    return (
        <div className="App">
            <Navbar />
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
                setMapCoords={setMapCoords}
                mapRef={mapRef}
            />
            <Map
                ref={mapRef}
                mapLib={maplibregl}
                initialViewState={{
                    longitude: mapCoords.longitude,
                    latitude: mapCoords.latitude,
                    zoom: mapZoom,
                }}

                pitchWithRotate={0}

                onMove={(evt) => setMapCoords(evt.viewState)}
                style={{ width: "100%", height: "calc(100vh - 80px)" }}
                mapStyle="https://api.maptiler.com/maps/019684ce-bf99-76e5-a986-319c7bdeb2ab/style.json?key=2aydo59FoTATDd9gbc2J">
                <NavigationControl position="top-left" />
            </Map>
        </div>
    );
}

export default App;
