import React, { createContext, useContext, useState, useMemo } from 'react';
// Assuming layers.json is correctly placed and accessible
import layersConfig from '../config/layers.json';

// 1. Create the Context
const LayerContext = createContext();

// Helper function to get initial state based on defaultVisibility
const getInitialActiveLayers = () => {
  return layersConfig
    .filter(layer => layer.defaultVisibility === true)
    .map(layer => layer.id);
};

// 2. Create the Provider Component
export const LayerProvider = ({ children }) => {
  const [activeLayerIds, setActiveLayerIds] = useState(getInitialActiveLayers);

  const toggleLayerVisibility = (layerId) => {
    setActiveLayerIds(prevActiveIds => {
      if (prevActiveIds.includes(layerId)) {
        // Remove the layer ID if it's already active
        return prevActiveIds.filter(id => id !== layerId);
      } else {
        // Add the layer ID if it's not active
        return [...prevActiveIds, layerId];
      }
    });
  };

  // Memoize context value to optimize performance
  const value = useMemo(() => ({
    activeLayerIds,
    toggleLayerVisibility,
    allLayers: layersConfig // Also provide the full config for convenience
  }), [activeLayerIds]);

  return (
    <LayerContext.Provider value={value}>
      {children}
    </LayerContext.Provider>
  );
};

// 3. Create the Custom Hook
export const useLayers = () => {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error('useLayers must be used within a LayerProvider');
  }
  return context;
}; 