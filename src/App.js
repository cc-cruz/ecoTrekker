import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Map, {NavigationControl, Source, Layer, Popup} from 'react-map-gl';
import Navbar from './components/navbar.js';
import MapFilterPanel from './components/MapFilterPanel';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import { LayerProvider, useLayers } from './contexts/LayerContext.js';
import DynamicLegend from './components/DynamicLegend';
import OnMapLayerToggles from './components/OnMapLayerToggles';
import bbox from '@turf/bbox'; // Import turf/bbox
import centroid from '@turf/centroid'; // Import turf/centroid
import * as pmtiles from 'pmtiles'; // Import pmtiles

// Setup PMTiles protocol
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

// Define Geoff's required map style URL
const GEOFF_MAP_STYLE_URL = 'https://api.maptiler.com/maps/019684ce-bf99-76e5-a986-319c7bdeb2ab/style.json?key=2aydo59FoTATDd9gbc2J';

// Bounding boxes for US States and Territories [xmin, ymin, xmax, ymax]
// Source: https://anthonylouisdagostino.com/bounding-boxes-for-all-us-states/ (NAD83)
const STATE_BOUNDING_BOXES = {
  'AL': [-88.473227, 30.223334, -84.88908, 35.008028],
  'AK': [-179.148909, 51.214183, 179.77847, 71.365162], // Crosses antimeridian
  'AS': [-171.089874, -14.548699, -168.1433, -11.046934],
  'AZ': [-114.81651, 31.332177, -109.045223, 37.00426],
  'AR': [-94.617919, 33.004106, -89.644395, 36.4996],
  'CA': [-124.409591, 32.534156, -114.131211, 42.009518],
  'CO': [-109.060253, 36.992426, -102.041524, 41.003444],
  'MP': [144.886331, 14.110472, 146.064818, 20.553802], // CNMI
  'CT': [-73.727775, 40.980144, -71.786994, 42.050587],
  'DE': [-75.788658, 38.451013, -75.048939, 39.839007],
  'DC': [-77.119759, 38.791645, -76.909395, 38.99511],
  'FL': [-87.634938, 24.523096, -80.031362, 31.000888],
  'GA': [-85.605165, 30.357851, -80.839729, 35.000659],
  'GU': [144.618068, 13.234189, 144.956712, 13.654383],
  'HI': [-178.334698, 18.910361, -154.806773, 28.402123],
  'ID': [-117.243027, 41.988057, -111.043564, 49.001146],
  'IL': [-91.513079, 36.970298, -87.494756, 42.508481],
  'IN': [-88.09776, 37.771742, -84.784579, 41.760592],
  'IA': [-96.639704, 40.375501, -90.140061, 43.501196],
  'KS': [-102.051744, 36.993016, -94.588413, 40.003162],
  'KY': [-89.571509, 36.497129, -81.964971, 39.147458],
  'LA': [-94.043147, 28.928609, -88.817017, 33.019457],
  'ME': [-71.083924, 42.977764, -66.949895, 47.459686],
  'MD': [-79.487651, 37.911717, -75.048939, 39.723043],
  'MA': [-73.508142, 41.237964, -69.928393, 42.886589],
  'MI': [-90.418136, 41.696118, -82.413474, 48.2388],
  'MN': [-97.239209, 43.499356, -89.491739, 49.384358],
  'MS': [-91.655009, 30.173943, -88.097888, 34.996052],
  'MO': [-95.774704, 35.995683, -89.098843, 40.61364],
  'MT': [-116.050003, 44.358221, -104.039138, 49.00139],
  'NE': [-104.053514, 39.999998, -95.30829, 43.001708],
  'NV': [-120.005746, 35.001857, -114.039648, 42.002207],
  'NH': [-72.557247, 42.69699, -70.610621, 45.305476],
  'NJ': [-75.559614, 38.928519, -73.893979, 41.357423],
  'NM': [-109.050173, 31.332301, -103.001964, 37.000232],
  'NY': [-79.762152, 40.496103, -71.856214, 45.01585],
  'NC': [-84.321869, 33.842316, -75.460621, 36.588117],
  'ND': [-104.0489, 45.935054, -96.554507, 49.000574],
  'OH': [-84.820159, 38.403202, -80.518693, 41.977523],
  'OK': [-103.002565, 33.615833, -94.430662, 37.002206],
  'OR': [-124.566244, 41.991794, -116.463504, 46.292035],
  'PA': [-80.519891, 39.7198, -74.689516, 42.26986],
  'PR': [-67.945404, 17.88328, -65.220703, 18.515683],
  'RI': [-71.862772, 41.146339, -71.12057, 42.018798],
  'SC': [-83.35391, 32.0346, -78.54203, 35.215402],
  'SD': [-104.057698, 42.479635, -96.436589, 45.94545],
  'TN': [-90.310298, 34.982972, -81.6469, 36.678118],
  'TX': [-106.645646, 25.837377, -93.508292, 36.500704],
  'VI': [-65.085452, 17.673976, -64.564907, 18.412655], // USVI
  'UT': [-114.052962, 36.997968, -109.041058, 42.001567],
  'VT': [-73.43774, 42.726853, -71.464555, 45.016659],
  'VA': [-83.675395, 36.540738, -75.242266, 39.466012],
  'WA': [-124.763068, 45.543541, -116.915989, 49.002494],
  'WV': [-82.644739, 37.201483, -77.719519, 40.638801],
  'WI': [-92.888114, 42.491983, -86.805415, 47.080621],
  'WY': [-111.056888, 40.994746, -104.05216, 45.005904],
};

// Define a bounding box for the Continental US [xmin, ymin, xmax, ymax]
const CONUS_BBOX = [-125, 24, -66.5, 49.5]; // Adjusted to more common CONUS extent

// Function to check if two bounding boxes intersect
const boxesIntersect = (box1, box2) => {
  // box format: [xmin, ymin, xmax, ymax]
  // Check for non-intersection which is easier
  const noIntersect =
    box1[2] < box2[0] || // box1 is left of box2
    box1[0] > box2[2] || // box1 is right of box2
    box1[3] < box2[1] || // box1 is below box2
    box1[1] > box2[3];   // box1 is above box2
  return !noIntersect;
};

// Function to get visible states based on map bounds
const getVisibleStates = (mapBoundsArray) => {
  if (!mapBoundsArray) return [];
  const visible = [];
  // Handle Antimeridian crossing for Alaska
  const mapLngWest = mapBoundsArray[0];
  const mapLngEast = mapBoundsArray[2];
  const crossesAntimeridian = mapLngEast < mapLngWest;

  for (const stateCode in STATE_BOUNDING_BOXES) {
    const stateBox = STATE_BOUNDING_BOXES[stateCode];
    
    // Special handling for Alaska if the map view crosses the antimeridian
    if (stateCode === 'AK' && crossesAntimeridian) {
         // Check intersection with western part of AK and eastern part of map view
        const intersectsWestAK = boxesIntersect([stateBox[0], stateBox[1], -179.999999, stateBox[3]], [mapLngWest, mapBoundsArray[1], 180, mapBoundsArray[3]]);
        // Check intersection with eastern part of AK and western part of map view
        const intersectsEastAK = boxesIntersect([179.0, stateBox[1], stateBox[2], stateBox[3]], [-180, mapBoundsArray[1], mapLngEast, mapBoundsArray[3]]);
        
        if (intersectsWestAK || intersectsEastAK) {
            visible.push(stateCode);
        }
    } else if (crossesAntimeridian) {
        // Check intersection for other states, splitting map bounds
         const intersectsWestMap = boxesIntersect(stateBox, [-180, mapBoundsArray[1], mapLngEast, mapBoundsArray[3]]);
         const intersectsEastMap = boxesIntersect(stateBox, [mapLngWest, mapBoundsArray[1], 180, mapBoundsArray[3]]);
         if (intersectsWestMap || intersectsEastMap) {
             visible.push(stateCode);
         }
    } else {
         // Normal intersection check
        if (boxesIntersect(stateBox, mapBoundsArray)) {
          visible.push(stateCode);
        }
    }
  }
  return visible;
};

function AppContent() {
  // State for search and map view control
  const [searchText, setSearchText] = useState('');
  const [mapCoords, setMapCoords] = useState({
    longitude: -119.5, // Keep desired initial CA longitude
    latitude: 37.0,    // Keep desired initial CA latitude
    zoom: 5            // Keep desired initial zoom
  });

  // Removed mapStyleUrl state

  // Map ref
  const mapRef = useRef();

  // Get layer state from context
  const { allLayers, activeLayerIds } = useLayers();

  // State to manage which category's toggles are shown on the map
  const [categoryForOnMapToggles, setCategoryForOnMapToggles] = useState(null);

  // State to hold fetched GeoJSON data for API layers
  const [apiLayerData, setApiLayerData] = useState({});
  // Ref to track state-specific data loading status for partitioned layers
  const layerStateDataRef = useRef({}); // { layerId: { visible: Set(), fetched: Set(), loading: Set(), error: Set() } }

  // State for popups and tooltips
  const [interactionData, setInteractionData] = useState(null);

  // Helper function to parse interaction templates
  const formatInteractionTemplate = (template, properties) => {
    if (!template || !properties) return '';
    return template.replace(/\{\{properties\.([^}]+)\}\}/g, (match, propName) => {
      return properties[propName] !== undefined ? properties[propName] : match;
    });
  };

  // --- BEGIN DEBUG LOGGING ---
  useEffect(() => {
    if (activeLayerIds.includes('natural_fire_risk')) {
       console.log(`[DEBUG] apiLayerData state for natural_fire_risk:`, apiLayerData['natural_fire_risk']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiLayerData, activeLayerIds]);
  // --- END DEBUG LOGGING ---

  const SWITCH_ZOOM_LEVEL = 9;
  const CUSTOM_FIRE_ICON_ID = 'active-fire-icon';
  const [mapIconsLoaded, setMapIconsLoaded] = useState(false);

  // Define the onLoad handler for the map
  const onMapLoad = useCallback(async (event) => {
    const map = event.target;
    console.log('[onMapLoad] Map loaded:', map);

    // Load custom icon for wildfires
    if (map && !map.hasImage('active-fire-icon')) {
      try {
        console.log('[onMapLoad] Attempting to load icon: /active-fire-nobg.png');
        const img = await map.loadImage('/active-fire-nobg.png');
        console.log('[onMapLoad] Image loaded successfully:', img);
        if (img && img.data) {
          map.addImage('active-fire-icon', img.data, { sdf: false }); // sdf: true if you want to color it with icon-color
          console.log('[onMapLoad] Icon "active-fire-icon" added to map.');
          setMapIconsLoaded(true); // Signal that icons are ready
        } else {
          console.error('[onMapLoad] Loaded image data is invalid or missing.');
          setMapIconsLoaded(false); // Or handle error appropriately
        }
      } catch (error) {
        console.error('[onMapLoad] Error loading PNG icon from path "/active-fire-nobg.png":', error, '. Please make sure to use a supported image type such as PNG or JPEG. Note that SVGs are not supported.');
        setMapIconsLoaded(false); // Or handle error appropriately
      }
    } else if (map && map.hasImage('active-fire-icon')) {
      console.log('[onMapLoad] Icon "active-fire-icon" already exists on map.');
      setMapIconsLoaded(true);
    } else if (!map) {
      console.error("[onMapLoad] Map object not available for loading icon.")
    }

  }, []); // No dependencies, runs once on map load

  // Effect to fetch data for active api_geojson and geojson_file layers
  useEffect(() => {
    activeLayerIds.forEach(layerId => {
      const layerConfig = allLayers.find(l => l.id === layerId);
      if (layerConfig && (!apiLayerData[layerId] || apiLayerData[layerId] === 'error')) { 
        if (layerConfig.source.type === 'api_geojson') {
          console.log(`Fetching data for layer: ${layerId} from ${layerConfig.source.location} (api_geojson)`);
          setApiLayerData(prevData => ({ ...prevData, [layerId]: 'loading' }));
          fetch(layerConfig.source.location)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log(`[DEBUG] Raw data fetched for ${layerId} (api_geojson):`, data);

              if (layerId === 'natural_fire_risk' && data && data.features) {
                const points = data.features.map(feature => {
                  if (feature && feature.geometry) {
                    try {
                      const center = centroid(feature.geometry);
                      return {
                        ...center, // Spread the GeoJSON point feature (type, geometry)
                        properties: feature.properties // Keep original properties for popups/tooltips
                      };
                    } catch (e) {
                      console.warn("Error calculating centroid for feature:", feature, e);
                      return null;
                    }
                  }
                  return null;
                }).filter(Boolean); // Remove any nulls from failed centroid calculations
                
                setApiLayerData(prevData => ({
                  ...prevData,
                  [layerId]: {
                    polygons: data, 
                    points: { type: 'FeatureCollection', features: points } 
                  }
                }));  
                console.log(`[DEBUG] Processed point data for ${layerId}:`, { type: 'FeatureCollection', features: points }); // Log the points data
                console.log(`Successfully processed polygon and point data for layer: ${layerId}`);

                // --- Zoom to Features Logic (for polygons) ---
                const conusFeatures = data.features.filter(feature => {
                  if (!feature || !feature.geometry) return false;
                  try {
                    const featureBbox = bbox(feature);
                    return boxesIntersect(featureBbox, CONUS_BBOX);
                  } catch (e) {
                    // console.warn("Could not calculate bbox for a feature during CONUS filtering:", e, feature);
                    return false; // Exclude if feature bbox calculation fails
                  }
                });
                let targetPolygonsForFitBounds;
                if (conusFeatures.length > 0) {
                    targetPolygonsForFitBounds = { type: 'FeatureCollection', features: conusFeatures };
                } else {
                    targetPolygonsForFitBounds = data;
                }
                const layerBbox = bbox(targetPolygonsForFitBounds);
                console.log(`[DEBUG] Calculated bbox for ${layerId} (polygons target: ${conusFeatures.length > 0 ? 'CONUS' : 'All'}): [${layerBbox[0]}, ${layerBbox[1]}, ${layerBbox[2]}, ${layerBbox[3]}]`);
                const isFiniteBbox = layerBbox.every(coord => Number.isFinite(coord));
                if (isFiniteBbox && mapRef.current) {
                    const mapInstance = mapRef.current.getMap(); // Get the raw maplibre map instance

                    const onFitBoundsMoveEnd = () => {
                      if (mapInstance) { // Check if mapInstance is still valid
                        console.log(`[DEBUG] After fitBounds for ${layerId} - Zoom: ${mapInstance.getZoom()}, Center: [${mapInstance.getCenter().lng}, ${mapInstance.getCenter().lat}]`);
                        mapInstance.off('moveend', onFitBoundsMoveEnd); // Remove listener
                      }
                    };
                    // Add listener before calling fitBounds, as fitBounds can be synchronous if no animation.
                    mapInstance.on('moveend', onFitBoundsMoveEnd);

                    mapRef.current.fitBounds(
                      [ [layerBbox[0], layerBbox[1]], [layerBbox[2], layerBbox[3]] ], 
                      { padding: 100, duration: 1000 }
                    );
                    console.log(`[DEBUG] fitBounds called for ${layerId} with finite bounds.`);
                } else {
                    console.warn(`[DEBUG] Calculated bounding box for ${layerId} contains non-finite values: ${JSON.stringify(layerBbox)}. Skipping fitBounds.`);
                }
              } else {
                // For other api_geojson layers, or if data is not as expected
                setApiLayerData(prevData => ({ ...prevData, [layerId]: data }));
                console.log(`Successfully fetched data for layer: ${layerId} (api_geojson)`);
              }
            })
            .catch(error => {
              console.error(`Error fetching data for layer ${layerId} (api_geojson):`, error);
              setApiLayerData(prevData => ({ ...prevData, [layerId]: 'error' }));
            });
        } else if (layerConfig.source.type === 'geojson_file') {
          console.log(`Fetching data for layer: ${layerId} from ${layerConfig.source.location} (geojson_file)`);
          setApiLayerData(prevData => ({ ...prevData, [layerId]: 'loading' }));
          const fileUrl = `http://localhost:3001/static_geojson/${layerConfig.source.location}`;
          fetch(fileUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${fileUrl}`);
              }
              return response.json();
            })
            .then(data => {
              console.log(`[DEBUG] Raw data fetched for ${layerId} (geojson_file):`, data);
              setApiLayerData(prevData => ({ ...prevData, [layerId]: data }));
              console.log(`Successfully fetched data for layer: ${layerId} (geojson_file)`);
            })
            .catch(error => {
              console.error(`Error fetching data for layer ${layerId} (geojson_file):`, error);
              setApiLayerData(prevData => ({ ...prevData, [layerId]: 'error' }));
            });
        } else if (layerConfig.source.type === 'state_partitioned_geojson') {
          // Placeholder for loading state-partitioned GeoJSON files (e.g., FEMA NFHL by state)
          // This will require logic to:
          // 1. Determine visible states based on map bounds (e.g., from mapRef.current.getBounds()).
          // 2. Construct file paths/URLs for these states (e.g., using layerConfig.source.basePath and a state identifier).
          // 3. Fetch and manage data for multiple state files, potentially aggregating them or handling them as separate sources.
          // 4. Add map coordinates/bounds to the useEffect dependency array to trigger re-fetching on map move.
          
          // Step 1: Get map bounds and determine visible states
          let currentMapBounds = null;
          let mapBoundsArray = null;
          if (mapRef.current) {
            try {
                currentMapBounds = mapRef.current.getBounds();
                 // Convert LngLatBounds to simple array [west, south, east, north]
                mapBoundsArray = [
                    currentMapBounds.getWest(),
                    currentMapBounds.getSouth(),
                    currentMapBounds.getEast(),
                    currentMapBounds.getNorth()
                ];
            } catch (e) {
                 console.error("Error getting map bounds:", e);
            }
          }
          
          if (mapBoundsArray) {
              const currentVisibleStatesSet = new Set(getVisibleStates(mapBoundsArray));
              // console.log(`Layer ${layerId} (${layerConfig.name || 'Unnamed Layer'}) requires states: ${[...currentVisibleStatesSet].join(', ')}`);
              
              // Initialize tracking for this layer if it doesn't exist
              if (!layerStateDataRef.current[layerId]) {
                layerStateDataRef.current[layerId] = {
                  visible: new Set(),
                  fetched: new Set(),
                  loading: new Set(),
                  error: new Set()
                };
              }
              const layerState = layerStateDataRef.current[layerId];

              // Determine states to fetch and states to remove
              const statesToFetch = new Set();
              for (const stateCode of currentVisibleStatesSet) {
                  if (!layerState.fetched.has(stateCode) && !layerState.loading.has(stateCode)) {
                      statesToFetch.add(stateCode);
                  }
              }

              const statesToRemove = new Set();
              for (const stateCode of layerState.fetched) {
                  if (!currentVisibleStatesSet.has(stateCode)) {
                      statesToRemove.add(stateCode);
                  }
              }
              
              // Update visible states tracker
              layerState.visible = currentVisibleStatesSet;

              // --- Handle Fetching New States ---
              if (statesToFetch.size > 0) {
                 console.log(`Layer ${layerId}: Fetching states:`, [...statesToFetch]);
                  statesToFetch.forEach(stateCode => {
                      layerState.loading.add(stateCode); // Mark as loading
                      const baseUrl = layerConfig.source.baseUrl || '';
                      const pattern = layerConfig.source.fileNamePattern || '{STATE_CODE}.geojson';
                      const fileName = pattern.replace('{STATE_CODE}', stateCode);
                      const stateGeoJsonUrl = `${baseUrl}${fileName}`;

                      fetch(stateGeoJsonUrl)
                          .then(response => {
                              if (!response.ok) {
                                  throw new Error(`HTTP error! status: ${response.status} for ${stateGeoJsonUrl}`);
                              }
                              return response.json();
                          })
                          .then(data => {
                              layerState.loading.delete(stateCode);
                              layerState.fetched.add(stateCode);
                              layerState.error.delete(stateCode); // Clear previous error if successful now
                              console.log(`Successfully fetched ${stateCode} for layer ${layerId}`);

                              // Add features to the main data state
                              setApiLayerData(prevData => {
                                  const currentLayerData = prevData[layerId] || { type: 'FeatureCollection', features: [] };
                                  const newFeatures = (data.features || []).map(f => ({ 
                                       ...f, 
                                       properties: { ...(f.properties || {}), _origin_state: stateCode } 
                                   }));
                                  return {
                                      ...prevData,
                                      [layerId]: {
                                          ...currentLayerData,
                                          features: [...currentLayerData.features, ...newFeatures]
                                      }
                                  };
                              });
                          })
                          .catch(error => {
                              console.error(`Error fetching data for state ${stateCode}, layer ${layerId}:`, error);
                              layerState.loading.delete(stateCode);
                              layerState.error.add(stateCode); // Mark as error
                              // Optionally update apiLayerData state to reflect the error or clear partial data
                          });
                  });
              }

              // --- Handle Removing Old States ---
              if (statesToRemove.size > 0) {
                  console.log(`Layer ${layerId}: Removing states:`, [...statesToRemove]);
                  statesToRemove.forEach(stateCode => {
                      layerState.fetched.delete(stateCode);
                      layerState.error.delete(stateCode); // Also clear error state if removed
                  });
                  // Update apiLayerData by filtering out features from removed states
                  setApiLayerData(prevData => {
                       const currentLayerData = prevData[layerId];
                       if (!currentLayerData || !currentLayerData.features) return prevData; // No data to filter

                       const filteredFeatures = currentLayerData.features.filter(f => 
                           !statesToRemove.has(f.properties?._origin_state)
                       );

                       // Only update if features actually changed
                       if (filteredFeatures.length !== currentLayerData.features.length) {
                            return {
                                ...prevData,
                                [layerId]: {
                                    ...currentLayerData,
                                    features: filteredFeatures
                                }
                           };
                       } else {
                            return prevData; // No change needed
                       }
                  });
              }

          } else {
              console.log(`Layer ${layerId} (${layerConfig.name || 'Unnamed Layer'}): Map bounds not available yet.`);
          }

          // Removed old placeholder console log
          // For now, no data will be actively fetched or set for this type in apiLayerData.
          // Consider setting a specific state like 'not_implemented' or 'pending_map_view_logic' if needed for UI feedback.
        }
      }
    });
  }, [activeLayerIds, allLayers, mapCoords]); // Dependencies: added mapCoords

  // Effect for cleanup: remove data for layers that are no longer active
  useEffect(() => {
    const activeFetchableLayerIds = allLayers
      .filter(l => activeLayerIds.includes(l.id) && (l.source.type === 'api_geojson' || l.source.type === 'geojson_file'))
      .map(l => l.id);

    setApiLayerData(currentData => {
      const newData = {};
      let changed = false;
      activeFetchableLayerIds.forEach(id => {
        if (currentData[id]) {
          newData[id] = currentData[id];
        }
      });
      if (Object.keys(currentData).length !== Object.keys(newData).length) {
        changed = true;
      }
      return changed ? newData : currentData; 
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLayerIds, allLayers]); // Ensure this disable comment is here

  const handleLayerClick = (event, layerConfig) => {
    if (!layerConfig.interactionConfig || layerConfig.interactionConfig.type !== 'popup') {
      return;
    }
    const { features, lngLat } = event;
    const clickedFeature = features && features[0];

    if (clickedFeature) {
      const htmlContent = formatInteractionTemplate(
        layerConfig.interactionConfig.template,
        clickedFeature.properties
      );
      setInteractionData({
        longitude: lngLat.lng,
        latitude: lngLat.lat,
        htmlContent: htmlContent,
        type: 'popup'
      });
    } else {
      setInteractionData(null); // Clear if no feature clicked
    }
  };

  const handleLayerHover = (event, layerConfig) => {
    if (!layerConfig.interactionConfig || layerConfig.interactionConfig.type !== 'tooltip') {
      if (interactionData && interactionData.type === 'tooltip') { // Clear existing tooltip if not on a tooltip layer
        setInteractionData(null);
      }
      return;
    }
    const { features, lngLat } = event;
    const hoveredFeature = features && features[0];

    if (hoveredFeature) {
      const htmlContent = formatInteractionTemplate(
        layerConfig.interactionConfig.template,
        hoveredFeature.properties
      );
      setInteractionData({
        longitude: lngLat.lng,
        latitude: lngLat.lat,
        htmlContent: htmlContent,
        type: 'tooltip'
      });
    } else if (interactionData && interactionData.type === 'tooltip') { // Clear tooltip if mouse leaves feature
      setInteractionData(null);
    }
  };
  
  const handleMouseLeaveMap = () => {
    // Clear tooltip when mouse leaves the map area entirely
    if (interactionData && interactionData.type === 'tooltip') {
      setInteractionData(null);
    }
  };

  // Filter to get only the active layer configurations
  const activeLayers = allLayers.filter(layer => activeLayerIds.includes(layer.id));

  return (
    <div className="App">
      <Navbar />
      <MapFilterPanel
        // Props for SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        setMapCoords={setMapCoords}
        mapRef={mapRef}
        setCategoryForOnMapToggles={setCategoryForOnMapToggles}
      />
      {/* On-map toggles panel */}
      <OnMapLayerToggles 
        allLayers={allLayers} 
        targetCategory={categoryForOnMapToggles} 
      />
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        padding={{ left: 370 }} // Keep padding if MapFilterPanel is visible on left
        initialViewState={{
          longitude: mapCoords.longitude,
          latitude: mapCoords.latitude,
          zoom: mapCoords.zoom
        }}
        pitchWithRotate={0}
        onMove={evt => setMapCoords(evt.viewState)} // Re-enabled onMove
        onLoad={onMapLoad}
        style={{width: "100%", height: " calc(100vh - 77px)"}}
        mapStyle={GEOFF_MAP_STYLE_URL} // Use Geoff's hardcoded style URL
        onClick={(e) => { // Add map-level click to clear popups if clicking outside a layer
            if (e.features && e.features.length > 0) {
                // Click was on a feature, let layer-specific handler take over
                // Find which layer was clicked. This is a simplification, assumes first feature's layer.
                const clickedLayerId = e.features[0].layer.id;
                const layerConfig = activeLayers.find(l => l.id === clickedLayerId);
                if(layerConfig) {
                    handleLayerClick(e, layerConfig);
                } else {
                     if (interactionData && interactionData.type === 'popup') setInteractionData(null);
                }
            } else {
                // Click was on the map base, not on any specific layer feature
                if (interactionData && interactionData.type === 'popup') setInteractionData(null);
            }
        }}
        onMouseMove={(e) => { // For tooltips
            if (e.features && e.features.length > 0) {
                const hoveredLayerId = e.features[0].layer.id;
                const layerConfig = activeLayers.find(l => l.id === hoveredLayerId);
                 if (layerConfig && layerConfig.interactionConfig && layerConfig.interactionConfig.type === 'tooltip') {
                    handleLayerHover(e, layerConfig);
                } else if (interactionData && interactionData.type === 'tooltip') { // Clear if moved off a tooltip layer
                    setInteractionData(null);
                }
            } else if (interactionData && interactionData.type === 'tooltip') { // Clear if moved off all features
                 setInteractionData(null);
            }
        }}
        onMouseLeave={handleMouseLeaveMap} // Clear tooltips when mouse leaves map
        interactiveLayerIds={activeLayers.map(l => l.id)} // Make active layers interactive
      >
        <NavigationControl position="top-right" />

        {/* Dynamically render Sources and Layers for active layers */}
        {activeLayers.map(layer => {
          let pointSourceData = null; 
          let polygonSourceData = null;
          let isLoading = false;
          let sourceDataType = layer.source.type;

          if (sourceDataType === 'geojson_url') {
            // Assuming geojson_url is always polygons for now, or a single representation
            polygonSourceData = layer.source.location;
          } else if (sourceDataType === 'api_geojson' || sourceDataType === 'geojson_file') {
            const fetchedLayerData = apiLayerData[layer.id];
            if (fetchedLayerData && fetchedLayerData !== 'loading' && fetchedLayerData !== 'error') {
              if (layer.id === 'natural_fire_risk' && fetchedLayerData.polygons && fetchedLayerData.points) {
                polygonSourceData = fetchedLayerData.polygons;
                pointSourceData = fetchedLayerData.points;
              } else {
                // Other GeoJSON layers that don't have separate point/polygon versions
                polygonSourceData = fetchedLayerData; 
              }
            } else if (fetchedLayerData === 'loading') {
              isLoading = true; 
            } else if (fetchedLayerData === 'error') {
                console.error(`Skipping render for layer ${layer.id} due to fetch error (${sourceDataType}).`);
            } 
          } else if (sourceDataType === 'pmtiles_vector') {
            polygonSourceData = layer.source.location; // PMTiles URL is for polygons here
            // If PMTiles also had a point source-layer, we'd handle it similarly to natural_fire_risk
          } else {
             console.warn(`Unsupported source type: ${sourceDataType} for layer ${layer.id}`);
          }

          // Skip if essential data for any representation is missing or loading
          if (isLoading) return null;
          if (layer.id === 'natural_fire_risk' && (!polygonSourceData || !pointSourceData)) return null;
          if (layer.id !== 'natural_fire_risk' && sourceDataType !== 'pmtiles_vector' && !polygonSourceData) return null; 
          if (sourceDataType === 'pmtiles_vector' && !polygonSourceData) return null; // polygonSourceData is the URL for pmtiles

          const sourceIdBase = `${layer.id}-source`;
          const layerIdBase = layer.id;

          const elementsToRender = [];

          // --- Logic for layers with Point (icon) representation at low zoom --- 
          if (layer.id === 'natural_fire_risk' && pointSourceData) {
            console.log(`[RENDER] CIRCLE layer for ${layer.id}. Data features: ${pointSourceData?.features?.length}`);
            
            const pointSourceKey = `${sourceIdBase}-points`;
            elementsToRender.push(
              <Source key={pointSourceKey} id={pointSourceKey} type="geojson" data={pointSourceData}>
                <Layer
                  id={`${layerIdBase}-points-fire-circles`}
                  type="circle"
                  source={pointSourceKey}
                  layout={{}}
                  paint={{
                    'circle-color': 'red',
                    'circle-opacity': 0.8,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#8B0000',
                    'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['coalesce', ['get', 'GISAcres'], 0],
                      0, 4,
                      1000, 6,
                      10000, 10,
                      50000, 15,
                      100000, 20
                    ]
                  }}
                  maxzoom={SWITCH_ZOOM_LEVEL}
                />
              </Source>
            );
          }

          // --- Logic for Polygon representation (or default for non-special cased layers) ---
          if (polygonSourceData) {
            const currentSourceId = (layer.id === 'natural_fire_risk' && pointSourceData) ? `${sourceIdBase}-polygons` : sourceIdBase;
            const currentLayerId = (layer.id === 'natural_fire_risk' && pointSourceData) ? `${layerIdBase}-polygons` : layerIdBase;

            const polygonLayerStyle = {
              id: currentLayerId,
              type: layer.layerConfig.type,
              source: currentSourceId,
              layout: layer.layerConfig.layout || {},
              paint: layer.layerConfig.paint || {},
              ...(layer.layerConfig.filter && { filter: layer.layerConfig.filter }),
              ...(sourceDataType === 'pmtiles_vector' && layer.source.sourceLayerName && { 'source-layer': layer.source.sourceLayerName }),
              ...(sourceDataType !== 'pmtiles_vector' && layer.layerConfig['source-layer'] && { 'source-layer': layer.layerConfig['source-layer'] })
            };
            if (layer.id === 'natural_fire_risk' && pointSourceData) {
              polygonLayerStyle.minzoom = SWITCH_ZOOM_LEVEL; 
            }

            const sourceProps = {
              id: currentSourceId,
              type: sourceDataType === 'pmtiles_vector' ? 'vector' : 'geojson',
              promoteId: layer.layerConfig.promoteId
            };
            if (sourceDataType === 'pmtiles_vector') {
              sourceProps.url = polygonSourceData; 
            } else {
              sourceProps.data = polygonSourceData; 
            }

            elementsToRender.push(
              <Source key={currentSourceId} {...sourceProps}>
                <Layer {...polygonLayerStyle} />
                {/* Outline for PMTiles Hazard Zones */}
                {layer.id === 'natural_fire_risk_pmtiles' && (
                  <Layer
                    id={`${currentLayerId}-outline`}
                    type="line"
                    source={currentSourceId}
                    source-layer={layer.source.sourceLayerName}
                    paint={{"line-color": "#FFA500", "line-width": 1}}
                    layout={{ "line-join": "round", "line-cap": "round" }}
                    minzoom={SWITCH_ZOOM_LEVEL}
                  />
                )}
                {/* Outline for ArcGIS Wildfires (if it's the polygon version being shown) */}
                {layer.id === 'natural_fire_risk' && pointSourceData && (
                   <Layer
                    id={`${currentLayerId}-outline`}
                    type="line"
                    source={currentSourceId} 
                    paint={layer.layerConfig.paint['fill-outline-color'] ? { 'line-color': layer.layerConfig.paint['fill-outline-color'], 'line-width': 1 } : { 'line-color': '#FFFFFF', 'line-width': 1 } }
                    minzoom={SWITCH_ZOOM_LEVEL}
                  />
                )}
              </Source>
            );
          }
          return elementsToRender.length > 0 ? <React.Fragment key={layer.id}>{elementsToRender}</React.Fragment> : null;
        })}

        {interactionData && (
          <Popup
            longitude={interactionData.longitude}
            latitude={interactionData.latitude}
            onClose={() => setInteractionData(null)}
            closeButton={interactionData.type === 'popup'} // Show close button only for popups
            closeOnClick={false} // Handled by map click or layer click
            // For tooltips, we might want an offset if the cursor blocks content
            // offset={interactionData.type === 'tooltip' ? [0, -15] : undefined}
            // anchor="bottom" // Might be good for tooltips
          >
            <div dangerouslySetInnerHTML={{ __html: interactionData.htmlContent }} />
          </Popup>
        )}
      </Map>
      <DynamicLegend />
    </div>
  );
}

// Main App component now just sets up the Provider
function App() {
  return (
    <LayerProvider>
      <AppContent />
    </LayerProvider>
  );
}

export default App;
