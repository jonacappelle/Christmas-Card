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

  draw_bottom_layer(scene, 30)
  draw_top_layer(scene, 20)
  addCamera(scene, canvas)
  addLights(scene)
  addPhotoDome(scene)
  addMusic(scene)

  return scene;
};


/* Draw the bottom layer, containing various small logos.
 * Make sure the plane size isn't too large to avoid overlapping with planes of the same and of other layers.
 *
 * @param {object} scene Babylon scene instance.
 * @param {number} number_of_planes Number of planes to fetch and draw.
 */
function draw_bottom_layer( scene, number_of_planes ) {

  let plane_size = 1.0
  let randomize_plane_size = true;

  let material = new BABYLON.StandardMaterial("", scene);
  material.specularColor = new BABYLON.Color3(0, 0, 0); // Disable highlights in the material (flat image)
  material.backFaceCulling = false; // Allways show the front and the back of an element
  let texture = new BABYLON.Texture("Images/logo-white.png", scene);
  texture.hasAlpha = true;
  material.diffuseTexture = texture

  draw_almost_equidistant_planes_on_sphere( scene, material, number_of_planes, plane_size, randomize_plane_size )

}


/* Draw the top layer, containing peoples faces.
 * Make sure the plane size isn't too large to avoid overlapping with planes of the same and of other layers.
 *
 * @param {object} scene Babylon scene instance.
 * @param {number} number_of_planes Number of planes to fetch and draw.
 */
function draw_top_layer( scene, number_of_planes ) {

  let plane_size = 2.5
  let randomize_plane_size = false;

  let material = new BABYLON.StandardMaterial("", scene);
  material.specularColor = new BABYLON.Color3(0, 0, 0); // Disable highlights in the material (flat image)
  material.backFaceCulling = false; // Allways show the front and the back of an element
  let texture = new BABYLON.Texture("Images/will_smith_outline.png", scene);
  texture.hasAlpha = true;
  material.diffuseTexture = texture

  draw_almost_equidistant_planes_on_sphere( scene, material, number_of_planes, plane_size, randomize_plane_size )

}


/* Draw (almost) equidistant planes on a sphere and add them to the scene.
 *
 * @param {object} scene Babylon scene instance.
 * @param {object} material Babylon material instance.
 * @param {number} number_of_planes Number of planes to fetch and draw.
 * @param {number} plane_size The average size of a plane (make sure input images have square dimensions!).
 * @param {bool} randomize_plane_size Add random factor to plane sizes.
 * @return {array} Babylon coordinate system X, Y, Z component arrays and phi and theta angle arrays.
 */
function draw_almost_equidistant_planes_on_sphere ( scene, material, number_of_planes, plane_size, randomize_plane_size ) {

  // Fetch the plane center-point coordinates
  let coordinates = calc_almost_optimal_spherical_point_distribution(number_of_planes)

  let plane;
  let current_plane_size = plane_size;

  for (let i=0; i<number_of_planes; i++) {

    // Add a random factor to plane sizes
    if (randomize_plane_size) {
      current_plane_size = plane_size - random_float_in_interval(plane_size * 0.2, plane_size * 0.8)
    }

    // Create new object and associate with scene
    plane = BABYLON.MeshBuilder.CreatePlane( "plane", { size: current_plane_size }, scene );

    plane.material = material // Associate plane with material (image)

    // Position the current plane
    plane.position.x = coordinates[0][i];
    plane.position.y = coordinates[1][i];
    plane.position.z = coordinates[2][i];

    // Convert the point's latitude (0~PI) to difference from perpendicular viewing angle around x axis (-PI/2~PI/2)
    plane.rotation.x = coordinates[3][i] - Math.PI/2 // Phi value minus PI/2

    // Convert the point's longitude (0~2*PI) to difference from perpendicular viewing angle around y axis (-PI/2~PI/2)
    plane.rotation.y = (coordinates[4][i] + Math.PI/2) % (2*Math.PI) // Theta value plus PI/2 and wrap around 2*PI
    // plane.rotation.y = Math.PI / 2 - Math.atan(plane.position.z / plane.position.x)
    // if ( plane.position.x < 0 ) { plane.rotation.y += Math.PI }

  }

}


/* Get random float in the desired interval.
 *
 * @param {number} max Top boundary.
 * @param {number} min Bottom boundary.
 * @return {number} Random float.
 */
function random_float_in_interval(min, max) {
  return Math.random() * (max - min) + min;
}


/* Calculate an approximative optimal distribution (equal distances) of points on top of a sphere.
 * The phi and theta angles represent the latitude (0~π), coming down from the pole, and longitude (0~2π).
 * Inspired by: https://stackoverflow.com/a/44164075/5153899
 *
 * @param {number} num_of_points Number of points.
 * @return {array} Babylon coordinate system X, Y, Z component arrays and phi and theta angle arrays.
 */
function calc_almost_optimal_spherical_point_distribution(num_of_points) {

  // Change the distance of the points to the origin (default: 1)
  let multipllication_factor = 10;

  // Arrange equidistant input points
  let indices = range(0.5, num_of_points, 1);

  // Pre-allocate output (at this point, XYZ are the usual Cartesian coordinates with Z representing height)
  let x = [];
  let y = [];
  let z = [];
  let phi = [];
  let theta = [];

  let i;

  // Calc latitude
  for (i=0; i<num_of_points; i++) {
    phi.push( Math.acos(1 - 2*indices[i]/num_of_points) );
  }

  // Calc longitude
  for (i=0; i<num_of_points; i++) {
    theta.push( Math.PI * (1 + 5**0.5) * indices[i] );
  }

  // Calc X
  let tmp_x;
  for (i=0; i<num_of_points; i++) {
    tmp_x = Math.cos(theta[i]) * Math.sin(phi[i]) * multipllication_factor;
    if ( tmp_x == 0 ) { tmp_x = 0.01 }; // When X is 0, the graphic is not visible
    x.push( tmp_x );
  }

  // Calc Y
  for (i=0; i<num_of_points; i++) {
    // y.push( Math.sin(theta[i]) * Math.sin(phi[i]) * multipllication_factor );
    y.push( - Math.sin(theta[i]) * Math.sin(phi[i]) * multipllication_factor );
  }

  // Calc Z
  for (i=0; i<num_of_points; i++) {
    z.push( Math.cos(phi[i]) * multipllication_factor );
  }

  // Substitute Y (height) and Z to get Babylon components
  return [x, z, y, phi, theta]
}


/* Python range equivalent function.
 *
 * @param {number} start Start of interval (included, 0 by default).
 * @param {number} stop Interval stop (excluded).
 * @param {number} step Step size (default: 1).
 * @return {array} Sequence of numbers.
 */
function range(start, stop, step) {
  if (typeof stop == 'undefined') {
    // one param defined
    stop = start;
    start = 0;
  }

  if (typeof step == 'undefined') {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
};


/* Add camera (view).
 *
 * @param {object} scene Babylon scene instance.
 * @param {object} material DOM canvas pointer.
 */
function addCamera (scene, canvas) {
  // Two-image display, needs cardboard viewer (VR). On PC change the view using the mouse.
  //var camera = new BABYLON.VRDeviceOrientationFreeCamera("DevOr_camera", new BABYLON.Vector3(0, 0, 0), scene);

  // Single-image device orientation tracking view. On PC change the view using the mouse.
  let camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 0, 0), scene);

  // Defines the target the camera should look at.
  camera.setTarget(new BABYLON.Vector3(0.1, 0, 0));

  // Attach the camera to the canvas
  camera.attachControl(canvas, true);
}


/* Add spherical background projection.
 *
 * @param {object} scene Babylon scene instance.
 */
function addPhotoDome (scene) {
  //new BABYLON.PhotoDome("testdome", "./Images/BackGround.jpg", { resolution: 256, size: 1000 }, scene)
  //new BABYLON.PhotoDome("testdome", "./Images/BackGround.jpg", { resolution: 512, size: 1000 }, scene);
  new BABYLON.PhotoDome("testdome", "./Images/milky-way-4k.png", { resolution: 500, size: 2000 }, scene);
}


/* Add lights (otherwise the objects won't be visible).
 *
 * @param {object} scene Babylon scene instance.
 */
function addLights (scene) {
  // new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
  // new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
  // new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 0, 0), scene);
  var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0,0,0), scene);
  var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0,0,0), scene);
  light.intensity = 1
}


/* Add fancy pants music.
 *
 * @param {object} scene Babylon scene instance.
 */
function addMusic (scene) {
    new BABYLON.Sound("Music", "./Songs/song.wav", scene, null, {
      loop: true,
      autoplay: true
    });
}
