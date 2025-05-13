import React from 'react';
import { useLayers } from '../contexts/LayerContext.js';
import './DynamicLegend.css'; // Assuming we create this for styling
import { FaFire } from 'react-icons/fa'; // Import FaFire

// --- Icon Component Map ---
// This allows us to dynamically render icons based on a string name
const iconComponents = {
  FaFire: FaFire,
  // Add other icons here as needed, e.g.:
  // MdWaterDrop: MdWaterDrop, 
};

// --- Legend Type Renderers --- 

const LegendIconEntry = ({ layerName, config, layerPaintConfig }) => {
  if (config.type === 'library_icon') {
    const IconComponent = iconComponents[config.iconName];
    // Determine color: prioritize circle-color, then fill-color, then default to black
    let iconColor = '#000000'; // Default color
    if (layerPaintConfig) {
      if (layerPaintConfig['circle-color']) {
        iconColor = layerPaintConfig['circle-color'];
      } else if (layerPaintConfig['fill-color']) {
        iconColor = layerPaintConfig['fill-color'];
      }
    }

    if (IconComponent) {
      return (
        <div className="legend-entry legend-library-icon">
          <IconComponent color={iconColor} style={{ marginRight: '8px' }} /> 
          <span>{config.description || layerName}</span>
        </div>
      );
    } else {
      console.warn(`Icon component not found: ${config.iconName} for layer ${layerName}`);
      return (
        <div className="legend-entry legend-icon-missing">
          <span>Icon Missing: {config.description || layerName}</span>
        </div>
      );
    }
  } else { // Existing logic for type 'icon' (static image URL)
    return (
      <div className="legend-entry legend-icon">
        <img src={config.iconUrl} alt={config.description || layerName} className="legend-icon-image" />
        <span>{config.description || layerName}</span>
      </div>
    );
  }
};

const LegendCategoricalEntry = ({ layerName, config }) => (
  <div className="legend-entry legend-categorical">
    <h5>{layerName}</h5>
    {config.categories.map(category => (
      <div key={category.value} className="categorical-item">
        <span className="color-swatch" style={{ backgroundColor: category.color }}></span>
        <span>{category.label}</span>
      </div>
    ))}
  </div>
);

const LegendContinuousRampEntry = ({ layerName, config }) => (
  <div className="legend-entry legend-continuous">
    <h5>{layerName} {config.unit ? `(${config.unit})` : ''}</h5>
    {/* Basic Placeholder for Continuous Ramp */}
    <div className="continuous-ramp-placeholder">
      <span>Low</span>
      {/* Ideally, render a gradient based on config.colorScheme */}
      <div className="gradient-bar" style={{ background: 'linear-gradient(to right, #edf8fb, #810f7c)' /* Example gradient */ }}></div>
      <span>High</span>
    </div>
    <small>(Scheme: {config.colorScheme}, Mode: {config.quantization.mode}, Classes: {config.quantization.numClasses})</small>
  </div>
);

// --- Main Legend Component --- 

const DynamicLegend = () => {
  const { allLayers, activeLayerIds } = useLayers();

  const activeLegendLayers = allLayers.filter(
    layer => activeLayerIds.includes(layer.id) && layer.legendConfig
  );

  if (activeLegendLayers.length === 0) {
    return null; // Render nothing if no active layers have legends
  }

  return (
    <div className="dynamic-legend">
      <h4>Legend</h4>
      {activeLegendLayers.map(layer => {
        const { legendConfig, layerConfig, name } = layer; // Destructure layerConfig and name
        switch (legendConfig.type) {
          case 'icon':
          case 'library_icon':
            return <LegendIconEntry key={layer.id} layerName={name} config={legendConfig} layerPaintConfig={layerConfig ? layerConfig.paint : null} />;
          case 'categorical':
            return <LegendCategoricalEntry key={layer.id} layerName={layer.name} config={legendConfig} />;
          case 'continuous_ramp':
            return <LegendContinuousRampEntry key={layer.id} layerName={layer.name} config={legendConfig} />;
          default:
            console.warn(`Unsupported legend type: ${legendConfig.type} for layer ${layer.id}`);
            return <div key={layer.id}><small>Legend not available for {layer.name}</small></div>; 
        }
      })}
    </div>
  );
};

export default DynamicLegend; 