# data toggles implementation

## 1. base map style toggle

-   **state management:** use react state (`usestate`) to store the current map style url.
    ```javascript
    const [mapstyleurl, setmapstyleurl] = usestate('initial_style_url');
    ```
-   **ui component:** create a dropdown, radio buttons, or simple buttons to represent available map styles.
-   **updating style:** on user selection, call `setmapstyleurl` with the new style url.
-   **react-map-gl integration:** pass the `mapstyleurl` state variable to the `mapstyle` prop of the `map` component.
    ```javascript
    <map mapstyle={mapstyleurl} ... />
    ```

## 2. data layer toggle (e.g., trails, pois)

-   **data source:** add a `source` component from `react-map-gl` for each data layer (e.g., geojson, vector tiles).
    ```javascript
    <source id="trail-data" type="geojson" data="path/to/trails.geojson">
      {/* layer component(s) go here */}
    </source>
    ```
-   **layer styling:** add one or more `layer` components inside the `source` to define how the data is visually represented (lines, points, polygons).
    ```javascript
    <layer id="trail-lines" type="line" source="trail-data" layout={{...}} paint={{...}} />
    ```
-   **state management:** use `usestate` for each toggleable layer to manage its visibility (boolean).
    ```javascript
    const [showtrails, setshowtrails] = usestate(true);
    ```
-   **ui component:** create checkboxes or toggle switches for each layer.
-   **conditional rendering:** wrap the `source` and `layer` components (or just the `layer` if toggling style variants) in a conditional block based on the state.
    ```javascript
    {showtrails && (
      <source id="trail-data" type="geojson" data="path/to/trails.geojson">
        <layer id="trail-lines" type="line" source="trail-data" ... />
      </source>
    )}
    ```
    *alternatively, use the `layout` prop's `visibility` property:*
    ```javascript
    <layer id="trail-lines" type="line" source="trail-data" layout={{ visibility: showtrails ? 'visible' : 'none' }} ... />
    ```
    (conditional rendering of the `source`/`layer` is often cleaner).

## 3. state location

-   manage toggle state in the component where the map is rendered (`app.js`) or lift state up to a parent component or context if toggles need to be controlled from elsewhere (e.g., a separate filter panel component). 