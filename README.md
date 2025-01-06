# IFC 3D Model Viewer

A web-based IFC model viewer built with TypeScript and [@thatopen/components](https://github.com/ThatOpen/engine_components) library. This viewer allows you to load, view, and interact with IFC (Industry Foundation Classes) models in a web browser.

## Project Structure

```
ifcBrowser/
├── index.html          # Main entry point
├── src/
│   ├── viewer/         # TypeScript files for the IFC viewer
│   │   └── index.ts    # Main viewer implementation
│   └── styles/         # CSS styles
│       └── main.css    # Main stylesheet
```

## Usage

1. Open the [index.html](index.html) file in your web browser.
2. Click on the "Load IFC" button to load an IFC model.
3. Interact with the model using the provided tools and features.

### World Settings
- Configure scene, camera, and renderer settings

### Import/Export
- Load IFC files
- Import fragment files (.frag)
- Export fragment files
- Dispose/reset the scene

### Selection Tools
- Toggle element visibility
- Isolate selected elements
- Show all elements
- View element properties

### Properties and Classification
- View detailed element properties
- Access model classification system
- Search and filter properties

## Development

1. The main viewer implementation is in `src/viewer/index.ts`
2. Add any additional styles in `src/styles/main.css`
3. The viewer container is available with ID `viewer-container`

### Dependencies

- [@thatopen/components](https://github.com/ThatOpen/engine_components) - Core BIM engine components
- [@thatopen/ui](https://github.com/ThatOpen/engine_components) - UI components
- [@thatopen/components-front](https://github.com/ThatOpen/engine_components) - Frontend components
