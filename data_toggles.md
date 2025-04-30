# Data Toggles Implementation Notes

This document outlines the implementation details for the map data toggles in the EcoTrekker application.

## 1. Base Map Style Toggle

-   **State Management:** Uses React state (`useState`) in `src/App.js` to store the URL of the currently selected map style.
    ```javascript
    // In App.js
    const [mapStyleUrl, setMapStyleUrl] = useState(availableMapStyles['Streets']);
    ```
-   **UI Component:** Uses a custom component `src/components/toggles/MapStyleToggle.js` which renders a group of `<button>` elements styled via CSS (`MapStyleToggle.css`) to look like a segmented control. The active style is highlighted.
    ```javascript
    // In MapFilterPanel.js, receiving props from App.js
    <MapStyleToggle
      currentStyleUrl={mapStyleUrl}
      availableStyles={availableMapStyles} // Defined in App.js
      onStyleChange={setMapStyleUrl}
    />
    ```
-   **Updating Style:** Clicking a button calls the `onStyleChange` callback (which is `setMapStyleUrl` from `App.js`) with the new style URL.
-   **react-map-gl Integration:** The `mapStyleUrl` state variable from `App.js` is passed to the `mapStyle` prop of the `Map` component.
    ```javascript
    // In App.js
    <Map mapStyle={mapStyleUrl} ... />
    ```

## 2. Data Layer Toggles

-   **Data Source:** Add a `<Source>` component from `react-map-gl` for each distinct data layer (e.g., GeoJSON, vector tiles). Currently implemented for FEMA data:
    ```javascript
    // In App.js
    import femaDataFl from './data/fema_ca_local_data.geojson';
    // ...
    <Source id="fema-fl-pa-source" type="geojson" data={femaDataFl}>
      {/* Layer component(s) go here */}
    </Source>
    ```
-   **Layer Styling:** Add one or more `<Layer>` components inside the `<Source>` to define the visual representation (fill, line, circle, symbol, etc.).
    ```javascript
    // In App.js
    const femaLayerStyle = { /* ... style object ... */ };
    <Layer {...femaLayerStyle} />
    ```
-   **State Management:** Uses `useState` in `src/App.js` for each toggleable layer to manage its visibility (boolean).
    ```javascript
    // In App.js
    const [showFemaLayer, setShowFemaLayer] = useState(true);
    ```
-   **UI Component:** Uses a custom component `src/components/toggles/LayerToggle.js` which renders:
    *   An icon from `react-icons` (e.g., `FaLayerGroup`).
    *   A text label.
    *   A `<button>` styled via CSS (`LayerToggle.css`) to function and look like a toggle switch.
    *   A `title` attribute for a basic tooltip (derived from a `description` prop).
    ```javascript
    // In MapFilterPanel.js, receiving props from App.js
    <LayerToggle
      layerId="fema-data"
      label="FEMA Data"
      description="Show/Hide FEMA Disaster Areas"
      isVisible={showFemaLayer}
      onToggle={setShowFemaLayer}
    />
    ```
-   **Conditional Rendering:** The `<Source>` and `<Layer>` components in `App.js` are wrapped in a conditional block based on the visibility state.
    ```javascript
    // In App.js
    {showFemaLayer && (
      <Source id="fema-fl-pa-source" type="geojson" data={femaDataFl}>
        <Layer {...femaLayerStyle} />
      </Source>
    )}
    ```
-   **Future Layers:** More data layers (e.g., Trails, Points of Interest, Wildfire Risk Zones) need to be added. This involves:
    1.  Acquiring the data source (e.g., finding/adding a `trails.geojson` file to `src/data/`).
    2.  Adding state management (`useState`) in `App.js` for the new layer's visibility.
    3.  Adding the `<Source>` and `<Layer>` components (with appropriate styling) in `App.js`, wrapped in their conditional rendering block.
    4.  Adding another `<LayerToggle>` instance within `MapFilterPanel.js`, passing the relevant state, setter, label, and description.

-   **Layer Interactivity (Click Popups - *Planned*):**
    *   **Goal:** Allow users to click on a designated county polygon on the map to see a popup displaying details like the county name and the type(s) of assistance designated (IA/PA).
    *   **Implementation Steps (Target: `src/App.js`):**
        1.  Import `Popup` from `react-map-gl`.
        2.  Add state (`popupInfo`, `setPopupInfo`) initialized to `null` to store clicked feature data.
        3.  Add `interactive={true}` prop to the FEMA data `<Layer>`.
        4.  Add `interactiveLayerIds={[femaLayerStyle.id]}` prop to the `<Map>`.
        5.  Implement an `onClick` handler function (`handleMapClick`) for the `<Map>`:
            *   Check `event.features` for features from the FEMA layer (`femaLayerStyle.id`).
            *   If a feature is found, extract relevant properties (county name, IA/PA status) and coordinates.
            *   Call `setPopupInfo` with the extracted data.
        6.  Conditionally render the `<Popup>` component inside the `<Map>` based on `popupInfo` state, passing necessary props (`longitude`, `latitude`, `onClose`, etc.) and displaying the extracted properties.
    *   **Property Names:** Due to the large size of the `src/data/fema_dr4683ca.geojson` file preventing easy inspection, the initial code implementation will use **placeholder property names** (e.g., `CountyName`, `IADesignated`, `PADesignated`) within the `handleMapClick` function and the `<Popup>` rendering. **These placeholders MUST be verified and updated by manually inspecting the GeoJSON file to find the correct property keys.**

## 3. UI Structure and State Location

-   **Filter Panel:** Toggles are hosted within the `src/components/MapFilterPanel.js` component, which also includes the `SearchBar`. This panel is positioned absolutely over the map using CSS (`MapFilterPanel.css`). Potential conflicts with map controls are mitigated by adding padding to the `Map` component in `App.js` (`padding={{ left: 370 }}`).
-   **State Location:** All toggle states (`showFemaLayer`, `mapStyleUrl`) are currently managed within the main `src/App.js` component using `useState`. State variables and setters are passed down as props to `MapFilterPanel`, which then passes them to the respective toggle components (`LayerToggle`, `MapStyleToggle`). This is suitable for the current scale but could be refactored to use React Context or a state management library if complexity increases significantly.

## 4. Alternative UI Approach (Not Implemented)

-   **Shadcn/ui + Tailwind CSS:** An alternative approach using the `shadcn/ui` component library and Tailwind CSS was considered to achieve a more modern UI with pre-built components more easily.
-   **Benefits:** Would provide accessible, well-styled components like `<Switch>`, `<Tooltip>`, `<Select>`, `<Accordion>` out-of-the-box, along with easy integration of `lucide-react` icons and streamlined theming/styling via Tailwind utilities. This could accelerate development of features like collapsible sections, better tooltips, and precise visual alignment.
-   **Reason Not Implemented:** Significant issues were encountered during the setup phase (Phase 1 of the plan) related to installing and running the necessary command-line tools (`tailwindcss init`, `shadcn-ui init/add`) within the current Node.js/npm environment (Node v22.9.0). These issues prevented the successful initialization of Tailwind and `shadcn/ui`.
-   **Future Consideration:** If the underlying environment issues are resolved (e.g., by managing Node versions with `nvm` and using an LTS version like v20, resolving shell configuration problems), migrating to `shadcn/ui` could be revisited for future UI enhancements. 

## 5. Troubleshooting and Workarounds Encountered

During implementation, several environment and build issues were encountered:

-   **Tailwind CSS / shadcn/ui Initialization Failure:**
    *   **Issue:** Repeated attempts to initialize Tailwind CSS (`npx tailwindcss init -p`) or use the `shadcn-ui` CLI failed with `command not found` errors.
    *   **Diagnosis:** Investigation revealed that `npm install` was not correctly installing the `tailwindcss` package into `node_modules` and/or creating the necessary executable link in `node_modules/.bin`, even after clearing `node_modules`, cleaning the `npm` cache (`npm cache clean --force`), and reinstalling dependencies multiple times.
    *   **Root Cause:** Suspected incompatibility between the Node.js/npm versions used (Node v22.9.0, npm v10.8.3) and the project dependencies or potential shell configuration conflicts preventing `nvm` setup.
    *   **Workaround:** The Tailwind CSS / `shadcn/ui` approach was abandoned in favor of using standard React components, custom CSS, and the `react-icons` library to allow progress on UI features.

-   **`react-map-gl` Compilation Error (`Cannot resolve 'mapbox-gl'`):**
    *   **Issue:** After successfully implementing the toggles with standard components, the application failed to compile, reporting that it could not find the `mapbox-gl` module.
    *   **Diagnosis:** This occurred despite the project being configured to use `maplibre-gl` (specified in `package.json` and passed via the `mapLib` prop to the `Map` component). The build process associated with `react-scripts` and `react-map-gl` v7 was incorrectly attempting to resolve the Mapbox dependency.
    *   **Workaround:** The `mapbox-gl` package was installed as a *dev dependency* (`npm install --save-dev mapbox-gl`). This satisfies the build tool's module resolution check, allowing the application to compile successfully. The package is not used at runtime due to the explicit `mapLib={maplibregl}` prop ensuring MapLibre is used for rendering. 