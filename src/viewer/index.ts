/* 
Imports:
- `web-ifc` to get some IFC items.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
*/

//import * as WEBIFC from "web-ifc";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as CUI from "@thatopen/ui-obc";
import { FragmentsGroup } from "@thatopen/fragments";

/* 
  There is to define a function to load the IFC programmatically. 
*/
async function loadIfc() {
  const file = await fetch("./src/viewer/5081-1410.ifc");
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await fragmentIfcLoader.load(buffer);
  //model.name = "example";
  world.scene.three.add(model);
}

/* 
  To save the fragments so that you don't need to open the IFC file 
  each time. Instead, the next time you can load the fragments directly. 
  Defining a function to export and download fragments:
*/

async function exportFragments() {
  // Get the fragments manager
  const fragmentsManager = components.get(OBC.FragmentsManager);
  // Making sure fragmentModel exists and has elements
  if (!fragmentModel) {
      return;
  }

  // TO DO: There is to implement code to export also the properties from the IFC file when exporting fragments.
  // There is to create another function for this using
  // fragmentModel.getLocalProperties();

  // Convert the fragments to a binary export file
  const fragmentBinary = fragmentsManager.export(fragmentModel);
  const blob = new Blob([fragmentBinary]);  // blob to store the binaryu data
  const url = URL.createObjectURL(blob);  // URL to download the JSON data
  const a = document.createElement('a');  // create a link element
  a.href = url;  // set the href attribute to the URL
  a.download = `model_fragments.frag`;  // use a default name for the fragment file
  a.click();  // click the link to download the file
  URL.revokeObjectURL(url);  // revoke the URL to free up memory
}

/*
  Function to import fragments.
*/

async function importFragments() {
  const input = document.createElement('input'); //create an input element
  input.type = 'file';  //set the type attribute to file
  input.accept = '.frag';  //set the accept attribute to .frag extension files
  const reader = new FileReader();  //create a FileReader object
  
  // when the file is read, parse the binary and create new projects
  reader.addEventListener("load", () => {
    const binary = reader.result;   //get the binary data from the FileReader object
    if (!(binary instanceof ArrayBuffer)) { 
      return; 
    }  //if the file data is not found, return
    const fragmentBinary = new Uint8Array(binary);
    const fragmentsManager = components.get(OBC.FragmentsManager);
    fragmentsManager.load(fragmentBinary);
  });
        
  // when the user selects a file, read the file as text
  input.addEventListener('change', () => {
    const filesList = input.files;
    if (!filesList) { 
      return; 
    }
    reader.readAsArrayBuffer(filesList[0]); //we read the first file in the list
  });

  input.click(); //we click the input element to open the file dialog
}

/* 
  There is to dispose the memory if the user wants to reset the state of the scene, 
  especially if you are using Single Page Application technologies like React, 
  Angular, Vue, etc. To do that, you can simply call the `dispose` method:
*/

function disposeFragments() {
  const fragmentsManager = components.get(OBC.FragmentsManager);
  for (const [, group] of fragmentsManager.groups) {
    fragmentsManager.disposeGroup(group);
  }
  fragmentModel = undefined;
}

/*
  There is to work with the model properties when loading IFC files.
  First index the relation entities of the model and then a classifier
  to group the elements based on level and entities.
*/

async function processModel(model: FragmentsGroup) {
  const indexer = components.get(OBC.IfcRelationsIndexer);
  await indexer.process(model);

  const classifier = components.get(OBC.Classifier);
  await classifier.bySpatialStructure(model);
  classifier.byEntity(model);

  // To access the list of groups inside the classifier
  //console.log(classifier.list);

  // Creating two classification objetcs as we have two for the model
  // To Do: create classification based on pre defined types and show groupings based on entities, predefined types and stories.
  const classifications = [
    {
      system: "entities",
      label: "Entities"
    },
    {
      system: "spatialStructures",
      label: "Spatial Structures"
    }
  ];

  // Making sure classification tree is available
  if (updateClassificationsTree) {
    // Passing along the classifications
    updateClassificationsTree({ classifications });
  }
}

/*
  Function to show the properrties of the elements when clicked.
*/
async function onShowProperties() {
  if (!fragmentModel) {
    return;
  }
  const properties = await fragmentModel.getLocalProperties();
  console.log(properties);
}

/*
  Creating a simple scene with a camera and a renderer. 
*/
let fragmentModel: FragmentsGroup | undefined;
const container = document.getElementById("viewer-container")!; //viewer container id in index.html
const components = new OBC.Components();
const worlds = components.get(OBC.Worlds);

// Creating the classification tree using the CUI package
const [classificationsTree, updateClassificationsTree] = CUI.tables.classificationTree({
  components,
  classifications: []
});

// Creating the world
const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBCF.PostproductionRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBCF.PostproductionRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

components.init();

world.renderer.postproduction.enabled = true;
world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
world.camera.updateAspect();
world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

/*
  Makes the background of the scene transparent.
*/
// world.scene.three.background = null;

/* 
  When reading an IFC file, there is to convert it to a geometry called Fragments. 
  Fragments are a lightweight representation of geometry built on top of 
  THREE.js `InstancedMesh` to make it easy to work with BIM data efficiently. 
  
  All the BIM geometry in ThatOpenCompany libraries are Fragments, and they are lightweight,
  fast and there plenty of tools to work with them. 

  Why not just IFC?

  Graphics cards don't understand IFC. They underrstand triangles. There is to convert IFC files to triangles. 
  There are many ways to do it, some more efficient than others. Fragments are a very efficient way to display
  the triangles coming from IFC files.

  Once Fragments have been generated, you can export them and then load them back directly, without needing 
  the original IFC file. Fragments can load +10 times faster than IFC. 
  
  But fragments are not used outside ThatOpenCompany libraries. So to convert an IFC 
  file to fragments:
  */

const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);

/*
  To configure the path of the WASM files. 

  WASM is a way to run C++ code on the browser. These files are 
  the compilation of our `web-ifc` library. You can find them in 
  the github repo and in NPM. 
  
  These files need to be available to our app, so you have 2 options:

  - Download them and serve them statically.
  - Get them from a remote server.

  The easiest way is getting them from unpkg by writing the following:
  */

await fragmentIfcLoader.setup();

// If you want to the path to unpkg manually, then you can skip the line
// above and set them manually as below:
// fragmentIfcLoader.settings.wasm = {
//   path: "https://unpkg.com/web-ifc@0.0.66/",
//   absolute: true,
// };

/*
 To index, classify and load the fragments:
*/
fragments.onFragmentsLoaded.add( async (model) => {
  world.scene.three.add(model);
  if (model.hasProperties){
    await processModel(model);
  }
  // This is used in the onShowProperties function and others
  fragmentModel = model;
});

// Instanciate the highlighter which helps to track the element the mouse is hovering over
const highlighter = components.get(OBCF.Highlighter);
highlighter.setup({ world });
//If an element is too small and we want to zoom in automatically
highlighter.zoomToSelection = true;


// Event listener to manage the aspect ratio of our scene
container.addEventListener("resize", () => {
  world.renderer?.resize();
  world.camera.updateAspect();
});      

/* 
  Optionally, it is possible to exclude categories that there is no need 
  to convert to fragments like very easily:
*/

/*

const excludedCats = [
  WEBIFC.IFCTENDONANCHOR,
  WEBIFC.IFCREINFORCINGBAR,
  WEBIFC.IFCREINFORCINGELEMENT,
];

for (const cat of excludedCats) {
  fragmentIfcLoader.settings.excludedCategories.add(cat);
}
*/

/* 
  Further configuring the conversion using the `webIfc` object. 
  Here we make the IFC model go to the origin of the scene (this supports model federation):
  */

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

/*
  To get the resulted model every time a new model is loaded, 
  subscribe to the following event anywhere in your app:


 fragments.onFragmentsLoaded.add((model) => {
  console.log(model);
});

*/

/* 
  Using `@thatopen/ui` library to add some simple UI elements to the viewer app. 
  
  First, there is to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="IFC Viewer" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
        <bim-button label="Load IFC"
          @click="${() => {
            loadIfc();
          }}">
        </bim-button>  
            
        <bim-button label="Export fragments"
          @click="${() => {
            exportFragments();
          }}">
        </bim-button>  
            
        <bim-button label="Dispose fragments"
          @click="${() => {
            disposeFragments();
          }}">
        </bim-button>
      
      </bim-panel-section>
      
    </bim-panel>
  `;
});

document.body.append(panel);

/* 
  Logic that adds a button to the screen when the user is visiting the app from their phone.
  Allowing to show or hide the menu. Otherwise, the menu would make the app unusable.
*/

const button = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${() => {
          if (panel.classList.contains("options-menu-visible")) {
            panel.classList.remove("options-menu-visible");
          } else {
            panel.classList.add("options-menu-visible");
          }
        }}">
      </bim-button>
    `;
});

document.body.append(button);