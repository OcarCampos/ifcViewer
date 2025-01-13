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
import * as THREE from "three";

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
async function showProperties() {
  // Making sure fragmentModel exists
  if (!fragmentModel){
    return;
  }
  // Highliger selection
  const highlighter = components.get(OBCF.Highlighter);
  const selection = highlighter.selection.select;
  const indexer = components.get(OBC.IfcRelationsIndexer);
  // If no object is selected
  if (Object.keys(selection).length === 0) {
    return;
  }

  // Iterate over the selected objects
  for (const fragmentID in selection) {
    const expressIDs = selection[fragmentID];
    for (const id of expressIDs) {
        // IsDefinedBy is one relation type, but there are more, must explore the others. Read IFC documentation.
        // Also there is a better way to provide the model to the indexer based on the selection made by the highlighter
        // First the fragment manager components contains all the list of all the loaded fragments
        // Knowing the fragment ID you can get the corresponding fragment instance
        // Knowing the fragment instance you can get its group properties which it is the actual IFC model
        // By doing this it is possible to work with multiple models.
        // TIP: fragments.list.get(fragmentID)
        const psets = indexer.getEntityRelations(fragmentModel, id, "IsDefinedBy");
        //console.log(psets);
        if (psets){
            for (const expressId of psets){
                const prop = await fragmentModel.getProperties(expressId);
                console.log(prop);
            }
        }
    }
  }
}

/*
  Function to toggle the visibility of the elements when clicked.
*/
function toggleVisibility() {
  // Highlighting the selected element
  const highlighter = components.get(OBCF.Highlighter);
  const fragments = components.get(OBC.FragmentsManager);
  const selection = highlighter.selection.select;
  // If no object is selected
  if (Object.keys(selection).length === 0) {
    return;
  }

  // Iterate over the selected objects and toggle their visibility
  for (const fragmentID in selection) {
    const fragment = fragments.list.get(fragmentID);
    const expressIDs = selection[fragmentID];
    for (const id of expressIDs){
      if(!fragment) { continue; }
      const isHidden = fragment.hiddenItems.has(id);
      if (isHidden) {
        fragment.setVisibility(true,[id]);
      } else {
        fragment.setVisibility(false,[id]);
      }
    }
  }
}

/*
  Function to isolate the selection of an element
*/
function isolateSelection() {
  const highlighter = components.get(OBCF.Highlighter);
  const hider = components.get(OBC.Hider);
  const selection = highlighter.selection.select;
  hider.isolate(selection);
}

/*
  Function to show all elements
*/
function showAll() {
  const hider = components.get(OBC.Hider);
  hider.set(true);
}

/*
function to open the classifier table
*/
function classifier() {
  if (!floatingGrid) {
    return;
  }
  // Opening and closing the classifier panel depending on current status
  if (floatingGrid.layout !== "classifier") {
    floatingGrid.layout = "classifier";
  } else {
    floatingGrid.layout = "main";
  }
}

/*
  Function to open the world table
*/
function worldUpdate() {
  if (!floatingGrid){
    return;
  }
  floatingGrid.layout = "world";
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

// Initializing the components
components.init();

// Setting up the scene
world.renderer.postproduction.enabled = true;
world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
world.camera.updateAspect();
world.scene.setup();

// Creating the grids
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

// Grid for the floating toolbar
const floatingGrid = BUI.Component.create<BUI.Grid>( () => {
  return BUI.html `
      <bim-grid
          floating
          style="padding: 20px"
      ></bim-grid>
  `;
});

// Panel to display the properties of the elements we select or want to display properties
const elementPropertyPanel = BUI.Component.create<BUI.Panel>( () => {
  // Instanciating the actual properties to display in the table
  const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
      components,
      fragmentIdMap: {}
  });
  
  const highlighter = components.get(OBCF.Highlighter);
  // highlighter emits an event every time an element is selected.
  // so we can add our logic to it to display the properties of the selected element
  // In this case we open the panel when an element is selected
  highlighter.events.select.onHighlight.add((fragmentIdMap) => {
      if (!floatingGrid){
          return;
      }
      floatingGrid.layout = "secondary";	
      //Updating fragmentIDMap and Table
      updatePropsTable({fragmentIdMap});
      propsTable.expanded = false;
  });

  // In this case we close the panel when an element is deselected
  highlighter.events.select.onClear.add(() => {
      //Emptying the fragmentIDMap
      updatePropsTable({fragmentIdMap: {}});
      if (!floatingGrid){
          return;
      }
      floatingGrid.layout = "main";	
  });

  // For the search in the properties table
  const search = (e: Event) => {
      const input = e.target as BUI.TextInput;
      propsTable.queryString = input.value;
  }
  
  return BUI.html `
      <bim-panel>
          <bim-panel-section name="property" label="Property Information" icon="solar:document-bold" fixed>
              <bim-text-input @input=${search} placeholder="Search..."></bim-text-input>
              ${propsTable}
          </bim-panel-section>
      </bim-panel>
  `;
});

// Panel for the classifier
const classifierPanel = BUI.Component.create<BUI.Panel>( () => {
  return BUI.html `
      <bim-panel style="width: 400px;">
          <bim-panel-section name="classifier" label="Classifier" icon="solar:document-bold" fixed>
              <bim-label>Classifications</bim-label>
              ${classificationsTree}
          </bim-panel-section>
      </bim-panel>
  `;
})

// Panel to make changes in the world components (scene, camera, renderer, etc.)
const worldPanel = BUI.Component.create<BUI.Panel>( () => {
  const [worldsTable] = CUI.tables.worldsConfiguration({ components });

  // Function for the search in the world table
  const search = (e: Event) => {
      const input = e.target as BUI.TextInput;
      worldsTable.queryString = input.value;
  }
  
  return BUI.html `
      <bim-panel>
          <bim-panel-section name="world" label="World Information" icon="solar:document-bold" fixed>
              <bim-text-input @input=${search} placeholder="Search..."></bim-text-input>
              ${worldsTable}
          </bim-panel-section>
      </bim-panel>
  `;
})

//Floating toolbar
const toolbar = BUI.Component.create<BUI.Toolbar>( () => {
  const [loadIfcBtn] = CUI.buttons.loadIfc({components: components});
  // For optimizing toolbar view we will use tool-tips instead of labels
  // So when the user hover over the icons we see the tool-tip and so we get rid of the labels 
  // Special case is the loadIfcBtn which is predefined by the OBC pacakage so to modify we do the following
  loadIfcBtn.tooltipTitle = "Load IFC";
  loadIfcBtn.label = "";

  return BUI.html `
    <bim-toolbar style="justify-self: center;">
      <!-- Importing IFC files -->
      <bim-toolbar-section label="Import">
        ${loadIfcBtn}
      </bim-toolbar-section>
      <!-- Fragments -->
      <bim-toolbar-section label="Fragments">
        <bim-button tooltip-title="Import" icon="mdi:cube" @click=${importFragments}></bim-button>
        <bim-button tooltip-title="Export" icon="tabler:package-export" @click=${exportFragments}></bim-button>
        <bim-button tooltip-title="Dispose" icon="tabler:trash" @click=${disposeFragments}></bim-button>
        <!-- TO DO: there is to add two more buttons to export and import properties from IFC Files -->
      </bim-toolbar-section>
      <!-- Selection Buttons -->
      <bim-toolbar-section label="Selection">
        <bim-button tooltip-title="Visibility" icon="mdi:eye" @click=${toggleVisibility}></bim-button>
        <bim-button tooltip-title="Isolate" icon="mdi:filter" @click=${isolateSelection}></bim-button>
        <bim-button tooltip-title="Show all" icon="tabler:eye-filled" @click=${showAll}></bim-button>
      </bim-toolbar-section>
      <!-- Properties -->
      <bim-toolbar-section label="Properties">
        <bim-button tooltip-title="Show" icon="clarity:list-line" @click=${showProperties}></bim-button>
      </bim-toolbar-section>
      <!-- Groups -->
      <bim-toolbar-section label="Groups">
        <bim-button tooltip-title="Classifier" icon="tabler:eye-filled" @click=${classifier}></bim-button>
      </bim-toolbar-section>
      <!-- World Update -->
      <bim-toolbar-section label="App">
        <bim-button tooltip-title="World" icon="tabler:brush" @click=${worldUpdate}></bim-button>
      </bim-toolbar-section>
    </bim-toolbar>
  `;
});

//Layout for the toolbar
floatingGrid.layouts = {
  // Main layout
  main: {
      template: `
          "empty" 1fr
          "toolbar" auto
          /1fr
      `,
      elements: {
          toolbar
      },
  },
  // Secondary layout that has the properties panel
  secondary: {
    template: `
        "empty elementPropertyPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
    `,
    elements: {
        toolbar,
        elementPropertyPanel
    },
},
// Layout that has the world panel
world: {
    template: `
        "empty worldPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
    `,
    elements: {
        toolbar,
        worldPanel
    },
},
  // Layout that has the classifier panel
  classifier: {
    template: `
        "empty classifierPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
    `,
    elements: {
        toolbar,
        classifierPanel
    },
  },
};
floatingGrid.layout = "main";

// Appends the floating toolbar to the container
container.appendChild(floatingGrid);

/*
* The following is extra code to add annotations on the side of the viewer in order to be able to make
* annotations over the IFC models that are displayed in the viewer.
*/

// List that will store all the annotation made by the user to be able to use them later. (save to file, etc)
const annotations: annotationData[] = [];

// Creating the table type that will store the annotations
type TableData = {
  Name: string;
  Observation: string;
  Guids: string;
};

// Event listener to point to the IFC element that the annotation relates to
const onRow = (event: CustomEvent) => {
  event.stopImmediatePropagation();
  const { row } = event.detail;

  // Add hover effect
  row.addEventListener("mouseover", () => {
    row.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  });

  row.addEventListener("mouseout", () => {
    row.style.backgroundColor = "transparent";
  });

  // Event listener to highlight and zoom to the IFC element related to the annotation
  row.addEventListener("click", () => {
    highlightAnnotation({
      name: row.data.Name,
      observation: row.data.Observation,
      priority: row.data.Priority,
      ifcGuids: JSON.parse(row.data.Guids),
      camera: JSON.parse(row.data.Camera)
    });
  });
};

// Creating the actual html for the table to store annotations
const annotationsTable = BUI.Component.create<BUI.Table<TableData>>( () => {
  return BUI.html `
      <bim-table @rowcreated=${onRow}>
      </bim-table>
  `;
});

// Creating and empty table to work on
annotationsTable.data = [];

// Creating the html table component
const htmlTable = BUI.Component.create( () => 
  BUI.html `
      <div style="display: flex; flex-direction: column; gap: 0.75rem; height: 100%;">
      ${annotationsTable}
      </div>
  `,
);

// Getting the annotations container from index.html
const annotationsContainer = document.getElementById("annotations-table")!;
// Appendinig the html table to the container.
annotationsContainer.append(htmlTable);


// Type for the priority of the annotation.
// Used in the interface for annotationInput
type Priority = "Low" | "Medium" | "High";

// Interface for annotation input data by the user
interface annotationInput {
  name: string;
  observation: string;
  priority: Priority;
}

// Interface for annotation data used internally
interface annotationData {
  name: string;
  observation: string;
  priority: Priority;
  ifcGuids: string[];
  camera: {position: THREE.Vector3, target: THREE.Vector3};
}

// Setting up highlighter colors for priorities
highlighter.add("priority-Low", new THREE.Color(0x59bc59));
highlighter.add("priority-Medium", new THREE.Color(0x597cff));
highlighter.add("priority-High", new THREE.Color(0xff7676));

async function highlightAnnotation (annotation: annotationData) {
  const fragments = components.get(OBC.FragmentsManager);
  const fragmentIdMap = fragments.guidToFragmentIdMap(annotation.ifcGuids);
  const highlighter = components.get(OBCF.Highlighter);

  highlighter.highlightByID("select", fragmentIdMap, true, false);

  if(!world){
    throw new Error("World does not exist");
  }

  const camera = world.camera;
  if(!camera.hasCameraControls()){
    throw new Error("World camera does not have camera controls");
  }

  await camera.controls.setLookAt(
    annotation.camera.position.x,
    annotation.camera.position.y,
    annotation.camera.position.z,
    annotation.camera.target.x,
    annotation.camera.target.y,
    annotation.camera.target.z
  )
}

// Function that will have the logic to add annotations
function addAnnotation(data: annotationInput) {
  console.log("Adding annotation ", data);
  const fragments = components.get(OBC.FragmentsManager);
  const hightlighter = components.get(OBCF.Highlighter);
  const guids = fragments.fragmentIdMapToGuids(hightlighter.selection.select);
  const camera = world.camera;

  if (!(camera.hasCameraControls())){
    throw new Error("Camera has no camera controls");
  }

  const position = new THREE.Vector3();
  camera.controls.getPosition(position);
  const target = new THREE.Vector3();
  camera.controls.getTarget(target);

  const annotationData: annotationData = {
    name: data.name,
    observation: data.observation,
    priority: data.priority,
    ifcGuids: guids,
    camera: {
      position,
      target
    },
  };

  const rowData = annotationData;
  // Creating a new row for the table with the annotation data
  const row: BUI.TableGroupData = {
    data: {
      Name: rowData.name,
      Observation: rowData.observation,
      Priority: rowData.priority,
      Guids: JSON.stringify(guids), // Converting the array to a JSON string so we can roll back if we need to
      Camera: rowData.camera ? JSON.stringify(rowData.camera) : "",
    },
  };
  // Pushing data to the list of annotations
  annotations.push(annotationData);
  // Pushing the new row to the table
  annotationsTable.data = [...annotationsTable.data, row];
  // Hiding the Guids column from the html table
  annotationsTable.hiddenColumns = ["Guids", "Camera"];
}

// Annotation data we get from the user
const nameInput = document.createElement("bim-text-input");
nameInput.label = "Name";
const observationInput = document.createElement("bim-text-input");
observationInput.label = "Observation";

// Dropdown menu for annotation's priority
const priorityInput = BUI.Component.create<BUI.Dropdown>( () => {
  return BUI.html `
      <bim-dropdown label="Priority">
          <bim-option label="Low"></bim-option>
          <bim-option label="Medium"></bim-option>
          <bim-option label="High"></bim-option>
      </bim-dropdown>
  `;
});

// Modal for the annotations
const annotateModal = BUI.Component.create<HTMLDialogElement>( () => {
  return BUI.html `
      <dialog>
          <bim-panel style="width: 20rem;">
            <bim-panel-section name="annotate" label="Annotate" icon="solar:document-bold" fixed>
                <bim-label>Create Annotation</bim-label>
                ${nameInput}
                ${observationInput}
                ${priorityInput}
                <bim-button
                  label="Create Annotation"
                  @click=${ () => {
                      const annotationValue: annotationInput = {
                        name: nameInput.value,
                        observation: observationInput.value,
                        priority: priorityInput.value[0] as Priority,
                      };
                      addAnnotation(annotationValue);
                      nameInput.value = "";
                      observationInput.value = "";
                      annotateModal.close();
                    }
                  }
                ></bim-button>
            </bim-panel-section>
          </bim-panel>
      </dialog>
  `;
});

// Appending the modal to the body of the page
document.body.appendChild(annotateModal);

// Actual button to add annotations
const annotator = BUI.Component.create<BUI.Button>( () => {
  return BUI.html `
      <bim-button
          tooltip-title="Add"
          icon="pajamas:file-addition"
          @click=${() => {
            annotateModal.showModal();
          }}
      ></bim-button> 
  `;
});

// To enable or disable priority highlighting
// we won't focus to the element in this function, just highlight according to priority color
function enablePriorityHighlight (value: boolean) {
  if (value) { 
    for (const annotation of annotations) {
      const fragmentIdMap = fragments.guidToFragmentIdMap(annotation.ifcGuids);
      highlighter.highlightByID(`priority-${annotation.priority}`, fragmentIdMap, false, false);
    }
  } else {
    // clears the highlighter if value false
    highlighter.clear();
  } 
}

// Function to toggle the annotation priority button state
const onTogglePriority = (event: Event) => {
  const btn = event.target as BUI.Button;
  btn.active = !btn.active;
  enablePriorityHighlight(btn.active);
}

// Button to manage the priorities
const annotationPriorityButton = BUI.Component.create<BUI.Button>( () => {
 return BUI.html `
     <bim-button
         icon="iconoir:fill-color"
         tooltip-title="Priority Filter"
         @click=${onTogglePriority}
     ></bim-button> 
 `;
});

// Getting html element for the add annotation button
const addAnnotationButton = document.getElementById("add-annotation-button")!;
// Adapting style to place the buttons side by side.
addAnnotationButton.style.display = "flex";
addAnnotationButton.style.gap = "8px";
// Adding the annotation button to the sidebar
 addAnnotationButton.append(annotator, annotationPriorityButton);