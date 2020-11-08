var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); // Generate the BABYLON 3D engine


// Create and populate the scene
var scene = createAndPopulateScene(engine, canvas);

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});


/* Create the scene and add all of its components
 *  p1: Scene instance
 *  p2: DOM canvas pointer
 */
function createAndPopulateScene (engine, canvas) {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.3, 0, 0);

    addCamera(scene, canvas)
    addLights(scene)
    addPhotoDome(scene)
    addMusic(scene)
    //addLegacyItems(scene)
    addDramcoLogoPlanes(scene)

    return scene;
};


/* Add camera (view)
 *  p1: Scene instance
 *  p2: DOM canvas pointer
 */
function addCamera (scene, canvas) {
  //var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,40), scene);

  // Two-image display, needs cardboard viewer (VR). On PC change the view using the mouse.
  //var camera = new BABYLON.VRDeviceOrientationFreeCamera("DevOr_camera", new BABYLON.Vector3(0, 0, 0), scene);

  // Single-image device orientation tracking view. On PC change the view using the mouse.
  let camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 0, 0), scene);

  // Defines the target the camera should look at.
  camera.setTarget(new BABYLON.Vector3(1, 0, 0));

  // WITH VR GLASSES
  // var camera = new BABYLON.VRDeviceOrientationArcRotateCamera ("Camera", Math.PI/2, Math.PI/4, 25, new BABYLON.Vector3 (0, 0, 0), scene);

  // Parameters : name, position, scene
  // var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -80), scene);
  // Targets the camera to a particular position. In this case the scene origin
  // camera.setTarget(BABYLON.Vector3.Zero());

  // Attach the camera to the canvas
  camera.attachControl(canvas, true);
}


/* Add spherical background projection
 *  p1: Scene instance
 */
function addPhotoDome (scene) {
  //new BABYLON.PhotoDome("testdome", "./Images/BackGround.jpg", { resolution: 256, size: 1000 }, scene)
  //new BABYLON.PhotoDome("testdome", "./Images/BackGround.jpg", { resolution: 512, size: 1000 }, scene);
  new BABYLON.PhotoDome("testdome", "./Images/milky-way-4k.png", { resolution: 500, size: 2000 }, scene);
}


/* Add lights (otherwise the objects won't be visible)
 *  p1: Scene instance
 */
function addLights (scene) {
  new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
}


/* Add fancy pants music
 *  p1: Scene instance
 */
function addMusic (scene) {
    new BABYLON.Sound("Music", "./Songs/song.wav", scene, null, {
      loop: true,
      autoplay: true
    });
}


/* Populate the landscape with DRAMCO logos.
 *  p1: Scene instance
 */
function addDramcoLogoPlanes (scene) {

  let material = new BABYLON.StandardMaterial("", scene);
  let texture = new BABYLON.Texture("Images/logo-white.png", scene);
  texture.hasAlpha = true;
  material.diffuseTexture  = texture

  let eigen = 10

  var box1 = BABYLON.MeshBuilder.CreatePlane("plane", {size: 2}, scene);
  box1.position.x = -10;
  box1.position.y = -0;
  box1.rotation.y = Math.atan(box1.position.x / box1.position.z)
  box1.material = material

  var box2 = BABYLON.MeshBuilder.CreatePlane("plane", {size: 3}, scene);
  box2.position.x = -10 / Math.sqrt(2);
  box2.position.y = 10 / Math.sqrt(2);
  box2.rotation.y = Math.atan(box2.position.x / box2.position.z)
  box2.rotation.x = Math.atan(box2.position.x / box2.position.y)
  box2.material = material

  var box3 = BABYLON.MeshBuilder.CreatePlane("plane", {size: 2.5}, scene);
  box3.position.x = -10 / Math.sqrt(3);
  box3.position.y = 10 / Math.sqrt(3);
  box3.position.z = 10 / Math.sqrt(3);
  box3.rotation.x = Math.atan(box3.position.x / box3.position.y)
  box3.rotation.y = Math.atan(box3.position.x / box3.position.z)
  box3.rotation.z = -Math.atan(box3.position.y / box3.position.z)
  box3.rotation.z = 0
  box3.material = material

  var box4 = BABYLON.MeshBuilder.CreatePlane("plane", {size: 2}, scene);
  box4.position.x = 10;
  box4.position.y = -0;
  box4.rotation.y = Math.atan(box4.position.x / box4.position.z)
  box4.material = material

}


/* Populate the landscape with legacy items.
 *  p1: Scene instance
 */
function addLegacyItems (scene) {

  // Add lights to the scene
  var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

  // Add the spheres
  var redMat = new BABYLON.StandardMaterial("redMat", scene);
  redMat.emissiveColor = new BABYLON.Color3(1, 0, 0);

  var greenMat = new BABYLON.StandardMaterial("greenMat", scene);
  greenMat.emissiveColor = new BABYLON.Color3(0, 1, 0);

  var blueMat = new BABYLON.StandardMaterial("blueMat", scene);
  blueMat.emissiveColor = new BABYLON.Color3(0, 0, 1);

  var blue2Mat = new BABYLON.StandardMaterial("whiteMat", scene);
  blue2Mat.emissiveColor = new BABYLON.Color3(0, 0.4, 0.5);

  var redSphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, scene);
  redSphere.material = redMat;

  var greenSphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, scene);
  greenSphere.material = greenMat;

  var blueSphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, scene);
  blueSphere.material = blueMat;

  var blue2MatSphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, scene);
  blue2MatSphere.material = blue2Mat;

  // Move the spheres
  redSphere.position.x = -3;
  redSphere.position.y = 18;
  greenSphere.position.x = -5;
  greenSphere.position.y = 12;
  blueSphere.position.x = 10;
  blueSphere.position.y = 18;
  blue2MatSphere.position.x = 5;
  blue2MatSphere.position.y = 19;

  // ./Images/Dramco_logo as location DOESN'T work for some reason

  var pic_KULEUVEN_logo = new BABYLON.StandardMaterial("photo", scene);

  pic_KULEUVEN_logo.diffuseTexture = new BABYLON.Texture("./Images/KULEUVEN_logo.png", scene);

  var options_KULEUVEN_logo = {
      width: 15,
      height: 6,
      depth: 1,
  };

  var box_kuleuven = BABYLON.MeshBuilder.CreateBox('box1', options_KULEUVEN_logo, scene);
  box_kuleuven.material = pic_KULEUVEN_logo;
  box_kuleuven.position.x = 5
  box_kuleuven.rotation.y = Math.PI

  var pic_DRAMCO_logo = new BABYLON.StandardMaterial("photo", scene);

  pic_DRAMCO_logo.diffuseTexture = new BABYLON.Texture("./Images/Dramco_logo.jpg", scene);

  var options_DRAMCO_logo = {
      width: 9,
      height: 9,
      depth: 1,
  };

  var box_DRAMCO = BABYLON.MeshBuilder.CreateBox('box2', options_DRAMCO_logo, scene);
  box_DRAMCO.material = pic_DRAMCO_logo;
  box_DRAMCO.position.x = 5
  box_DRAMCO.position.y = 10
  box_DRAMCO.rotation.y = Math.PI

  var pic_WC_logo = new BABYLON.StandardMaterial("photo", scene);

  pic_WC_logo.diffuseTexture = new BABYLON.Texture("./Images/WC_logo.png", scene);

  var options_WC_logo = {
      width: 15,
      height: 6,
      depth: 1,
  };

  var box_WC = BABYLON.MeshBuilder.CreateBox('box3', options_WC_logo, scene);
  box_WC.material = pic_WC_logo;
  box_WC.position.x = 5;
  box_WC.position.y = -10;
  box_WC.rotation.y = Math.PI;


  //Creation of a repeated textured material
  var kerstboom = new BABYLON.StandardMaterial("kerstboom", scene);
  kerstboom.diffuseTexture = new BABYLON.Texture("./Images/tree.png", scene);
  //kertboom.specularColor = new BABYLON.Color3(0, 0, 0);
  kerstboom.backFaceCulling = false; //Allways show the front and the back of an element
  kerstboom.diffuseTexture.hasAlpha = true;
  kerstboom.backFaceCulling = false;


  //Creation of a plane
  var tree_plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 75, height: 124}, scene);
  tree_plane.material = kerstboom;
  tree_plane.position.x = 50;
  tree_plane.rotation.y = -Math.PI/10


  // GUI for merry christmass button
  var plane_button = BABYLON.MeshBuilder.CreatePlane("plane2", {width: 18, height: 7}, scene);
  plane_button.position.y = -0;
  plane_button.position.x = -30;
  plane_button.rotation.y = Math.PI + Math.PI/10;

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_button);

  var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Press me !");
  button1.width = 18;
  button1.height = 7;
  button1.color = "white";
  button1.fontSize = 200;
  button1.background = "darkblue";
  button1.onPointerUpObservable.add(function() {
      alert("Merry Christmas!");
  });
  advancedTexture.addControl(button1);

}
