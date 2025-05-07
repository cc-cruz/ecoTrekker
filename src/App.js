import * as React from "react";
import { useState, useRef } from "react";
import Map, { NavigationControl, Marker } from "react-map-gl";
import Navbar from "./components/navbar.js";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import SearchBar from "./SearchBar";

function App() {
    const [searchText, setSearchText] = useState("");
    const [mapCoords, setMapCoords] = useState({
      coords: null,   // [lng, lat]
      bbox:  null
      /*
        longitude: -120.133,
        latitude: 38,
        */
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
                    longitude: mapCoords.longitude || -120,
                    latitude: mapCoords.latitude || 38,
                    zoom: 5.3,

                    /*
                    longitude: mapCoords.longitude,
                    latitude: mapCoords.latitude,
                    zoom: mapZoom,
                    */
                }}

                pitchWithRotate={0}

                onMove={(evt) => setMapCoords(evt.viewState)}
                style={{ width: "100%", height: "calc(100vh - 80px)" }}
                mapStyle="https://api.maptiler.com/maps/019684ce-bf99-76e5-a986-319c7bdeb2ab/style.json?key=2aydo59FoTATDd9gbc2J">
                <NavigationControl position="top-left" /> 
                {mapCoords.longitude && mapCoords.latitude && (
                <Marker
                    longitude={mapCoords.longitude}
                    latitude={mapCoords.latitude}
                    anchor="center"
                >
                <svg
                    height={30}
                    width={30}
                    viewBox="0 0 30 30"
                    style={{ transform: "translate(-15px, -15px)" }}
                >
                    <circle
                        cx={15}
                        cy={15}
                        r={10}
                        stroke="blue"
                        strokeWidth={2}
                        fill="rgba(0, 0, 255, 0.2)"
                    />
                </svg>
            </Marker>
            )}
                
        </Map>
        </div>
    );
}

export default App;
