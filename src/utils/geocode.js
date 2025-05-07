// src/utils/geocode.js
export function fetchGeocode(text) {
  const key = "2aydo59FoTATDd9gbc2J";  
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(text)}.json?key=${key}`;

  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Geocoding request failed (status ${res.status})`);
      }
      return res.json();
    })
    .then(data => {
      if (!data.features || data.features.length === 0) {
        throw new Error("No results found");
      }
      return data.features[0];
    });
}