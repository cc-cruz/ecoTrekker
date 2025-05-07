import React from "react";
import { fetchGeocode } from "./utils/geocode";

function SearchBar({ searchText, setSearchText, setMapCoords, mapRef }) {
  const handleSearch = () => {
    console.log("🔍 Searching for:", searchText);

    fetchGeocode(searchText)
      .then(feature => {
        console.log("📍 feature returned:", feature);

        const [lng, lat] = feature.center;
        setMapCoords({ longitude: lng, latitude: lat });

        // Optionally fit map to the feature's bounding box
        if (feature.bbox && mapRef?.current) {
          mapRef.current.fitBounds(
            [
              [feature.bbox[0], feature.bbox[1]],
              [feature.bbox[2], feature.bbox[3]],
            ],
            { padding: 20 }
          );
        }
      })
      .catch(err => {
        console.error("Geocoding error:", err);
        alert("Location not found. Please try a different search.");
      });
  };

  return (
    <div style={{ display: "flex", marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Enter an address"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{
          padding: "0.5rem",
          width: "300px",
          fontSize: "1rem",
          marginRight: "0.5rem",
        }}
      />
      <button onClick={handleSearch} style={{ padding: "0.5rem", fontSize: "1rem" }}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;