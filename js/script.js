
// Safari on iOS checker
$( document ).ready(function() {

  let ua = window.navigator.userAgent;
  let iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  let webkit = !!ua.match(/WebKit/i); // Turn null into true or an object into false
  let iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

  if (iOSSafari == true) {
    $('#safariNotification').show()
  }
});


let canvas = document.getElementById("renderCanvas"); // Get the canvas element
let engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); // Generate the BABYLON 3D engine

// Define global constants
const NUMBER_OF_FACES = 21; // Images must be labeled as "0.png" to "<NUMBER_OF_FACES-1>.png"
const NUMBER_OF_FACE_REPETITIONS = 3;
const NUMBER_OF_UNIQUE_LOGOS = 3; // Images must be labeled as "0.png" to "<NUMBER_OF_UNIQUE_LOGOS-1>.png"
const NUMBER_OF_LOGO_REPETITIONS = 5;

// Create and populate the scene
let scene = createAndPopulateScene(engine, canvas);

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
  let scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.3, 0, 0);

  // Determine the theme in random fashion
  let theme = 'Dark'
  if (Math.random() < 0.5) {
    theme = 'Light'
  }

  add_music(scene)
  add_camera(scene, canvas)
  add_lights(scene)
  draw_background(scene, theme)
  draw_monolayer(scene, theme)
  // draw_bottom_layer(scene, theme)
  // draw_top_layer(scene, theme)

  return scene;
}


/* Add camera (view).
 *
 * @param {object} scene Babylon scene instance.
 * @param {object} material DOM canvas pointer.
 */
function add_camera (scene, canvas) {
  // Two-image display, needs cardboard viewer (VR). On PC change the view using the mouse.
  //let camera = new BABYLON.VRDeviceOrientationFreeCamera("DevOr_camera", new BABYLON.Vector3(0, 0, 0), scene);

  // Single-image device orientation tracking view. On PC change the view using the mouse.
  let camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 0, 0), scene);

  // Defines the target the camera should look at.
  camera.setTarget(new BABYLON.Vector3(0.1, 0, 0));

  // Attach the camera to the canvas
  camera.attachControl(canvas, true);
}


/* Add lights (otherwise the objects won't be visible).
 *
 * @param {object} scene Babylon scene instance.
 */
function add_lights (scene) {
  // let light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0,0,0), scene);
  let light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0,0,0), scene);
  light.intensity = 1
}


/* Add spherical background projection.
 *
 * @param {object} scene Babylon scene instance.
 */
function draw_background (scene, theme) {
  let path = "./Image/Background/" + theme + "/" + Math.round(Math.random()) + ".jpg";
  // let photoDome = new BABYLON.PhotoDome("testdome", path, { resolution: 500, size: 2000 }, scene);
  let photoDome = new BABYLON.PhotoDome("testdome", path, scene);
}


/* Add fancy pants music.
 *
 * @param {object} scene Babylon scene instance.
 */
function add_music (scene) {
  new BABYLON.Sound("Music", "./Songs/song.wav", scene, null, {
    loop: true,
    autoplay: true
  });
}


/* Draw single layer containing faces and logos.
 *
 * @param {object} scene Babylon scene instance.
 * @param {str} theme 'Light' or 'Dark' theme identifier.
 */
function draw_monolayer( scene, theme ) {

  let plane_size = 2.5
  let randomize_plane_size = false;
  let shuffle_material = true;

  let material = []
  let texture;

  // Populate material with face images (each face once)
  let i, k, idx;
  for (k=0; k < NUMBER_OF_FACE_REPETITIONS; k++) {
    for (i = 0; i < NUMBER_OF_FACES; i++) {
      idx = k * NUMBER_OF_FACES + i
      material.push(new BABYLON.StandardMaterial("", scene));
      material[idx].specularColor = new BABYLON.Color3(0, 0, 0); // Disable highlights in the material (flat image)
      material[idx].backFaceCulling = false; // Allways show the front and the back of an element
      texture = new BABYLON.Texture("Image/Face/" + theme + "/" + i + ".png", scene);
      texture.hasAlpha = true;
      material[idx].diffuseTexture = texture
    }
  }

  // Add data to the already present material array
  for (k=0; k < NUMBER_OF_LOGO_REPETITIONS; k++) {
    for (i = 0; i < NUMBER_OF_UNIQUE_LOGOS; i++) {
      idx = NUMBER_OF_FACE_REPETITIONS * NUMBER_OF_FACES + k * NUMBER_OF_UNIQUE_LOGOS + i
      material.push(new BABYLON.StandardMaterial("", scene));
      material[idx].specularColor = new BABYLON.Color3(0, 0, 0); // Disable highlights in the material (flat image)
      material[idx].backFaceCulling = false; // Allways show the front and the back of an element
      texture = new BABYLON.Texture("Image/Logo/" + theme + "/" + i + ".png", scene); // Logo image names again start from 0
      texture.hasAlpha = true;
      material[idx].diffuseTexture = texture
    }
  }

  let number_of_planes = material.length

  draw_almost_equidistant_planes_on_sphere( scene, material, number_of_planes, plane_size, randomize_plane_size, shuffle_material );

}


/* Draw the top layer, containing peoples faces.
 * Make sure the plane size isn't too large to avoid overlapping with planes of the same and of other layers.
 *
 * @param {object} scene Babylon scene instance.
 * @param {str} theme 'Light' or 'Dark' theme identifier.
 */
function draw_top_layer( scene, theme ) {

  let plane_size = 2.5
  let randomize_plane_size = false;
  let shuffle_material = true;

  let material = []
  let texture;

  // Populate material with face images (each face once)
  let i;
  for (i = 0; i < NUMBER_OF_FACES; i++) {
    material.push(new BABYLON.StandardMaterial("", scene));
    material[i].specularColor = new BABYLON.Color3(0, 0, 0); // Disable highlights in the material (flat image)
    material[i].backFaceCulling = false; // Allways show the front and the back of an element
    texture = new BABYLON.Texture("Image/Face/" + theme + "/" + i + ".png", scene);
    texture.hasAlpha = true;
    material[i].diffuseTexture = texture
  }

  // Set the repetition of faces
  // If not a multiple of the number of faces, some faces may be represented by one instance more than others
  let number_of_planes = NUMBER_OF_FACE_REPETITIONS * NUMBER_OF_FACES;

  draw_almost_equidistant_planes_on_sphere( scene, material, number_of_planes, plane_size, randomize_plane_size, shuffle_material );

}


/* Draw the bottom layer, containing various small logos.
 * Make sure the plane size isn't too large to avoid overlapping with planes of the same and of other layers.
 *
 * @param {object} scene Babylon scene instance.
 * @param {str} theme 'Light' or 'Dark' theme identifier.
 */
function draw_bottom_layer( scene, theme ) {

  let plane_size = 1.0
  let randomize_plane_size = true;
  let shuffle_material = true;

  let material = []
  let texture;

  let i;
  for (i=0; i<NUMBER_OF_UNIQUE_LOGOS; i++) {
    material.push(new BABYLON.StandardMaterial("", scene));
    material[i].specularColor = new BABYLON.Color3(0, 0, 0); // Disable highlights in the material (flat image)
    material[i].backFaceCulling = false; // Allways show the front and the back of an element
    texture = new BABYLON.Texture("Image/Logo/" + theme + "/" + i + ".png", scene);
    texture.hasAlpha = true;
    material[i].diffuseTexture = texture
  }

  // Set the repetition of logos
  // If not a multiple of the number of logos, some logos may be represented by one instance more than others
  let number_of_planes = NUMBER_OF_LOGO_REPETITIONS * NUMBER_OF_UNIQUE_LOGOS;

  draw_almost_equidistant_planes_on_sphere( scene, material, number_of_planes, plane_size, randomize_plane_size, shuffle_material );

}


/* Draw (almost) equidistant planes on a sphere and add them to the scene.
 *
 * @param {object} scene Babylon scene instance.
 * @param {array} material Array of Babylon material instances.
 * @param {number} number_of_planes Number of planes to fetch and draw.
 * @param {number} plane_size The average size of a plane (make sure input images have square dimensions!).
 * @param {bool} randomize_plane_size Add random factor to plane sizes.
 * @param {bool} shuffle_material Shuffle material array (randomly select material for a plane).
 * @return {array} Babylon coordinate system X, Y, Z component arrays and phi and theta angle arrays.
 */
function draw_almost_equidistant_planes_on_sphere ( scene, material, number_of_planes, plane_size, randomize_plane_size, shuffle_material ) {

  // Fetch the plane center-point coordinates
  let coordinates = calc_almost_optimal_spherical_point_distribution(number_of_planes)

  if (shuffle_material) {
    material = shuffle_array(material)
  }

  let plane;
  let current_plane_size = plane_size;

  let k = 0;
  for (let i=0; i<number_of_planes; i++) {

    // Add a random factor to plane sizes
    if (randomize_plane_size) {
      current_plane_size = plane_size - random_float_in_interval(plane_size * 0.2, plane_size * 0.8)
    }

    // Create new object and associate with scene
    plane = BABYLON.MeshBuilder.CreatePlane( "plane", { size: current_plane_size }, scene );

    plane.material = material[k] // Associate plane with material (image)
    k = (k+1) % material.length // Roll over to repeat the material on multiple plaes

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

  let result = [];
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
};


/* Shuffle the array's elements using the Fisher-Yates algorithm.
 * Should be reasonably fast given only references are set.
 * Inspired by: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 *
 * @param {array} array Array that needs shuffling.
 * @return {array} Shuffled array.
 */
function shuffle_array(array) {

  let currentIndex, temporaryValue, randomIndex, i;

  // Shuffle 50 times
  for (i=0; i<50; i++){

    currentIndex = array.length;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  }

  return array;
}