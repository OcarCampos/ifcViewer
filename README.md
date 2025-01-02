# IFC 3D Model Viewer

A web-based IFC model viewer using HTMX and TypeScript.

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

## Development

1. Place your TypeScript viewer implementation in `src/viewer/index.ts`
2. Add any additional styles in `src/styles/main.css`
3. The viewer container is available with ID `viewer-container`
