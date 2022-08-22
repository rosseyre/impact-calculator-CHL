var time_s, seconds_per_frame
var canvas, cam, cam_tilt, renderer
var compute_complete
var img_tree_1, img_tree_2, img_tree_3
var img_shadow_1, img_shadow_2, img_shadow_3
var img_water, img_water_gradient, img_cream
var total_change,
  beef_environmental_change,
  chicken_environmental_change,
  pork_environmental_change
var beef_input_a,
  beef_input_b,
  chicken_input_a,
  chicken_input_b,
  pork_input_a,
  pork_input_b // UI inputs
var calculate_btn
var font1 // Fonts
var background_colour, background_colour_RGB, orange_colour

function preload() {
  font1 = loadFont('assets/fonts/IBMPlexSans-Regular.otf')
  img_tree_1 = loadImage('assets/imgs/tree1.png')
  img_tree_2 = loadImage('assets/imgs/tree2.png')
  img_tree_3 = loadImage('assets/imgs/tree3.png')

  img_shadow_1 = loadImage('assets/imgs/tree_shadow_1.png')
  img_shadow_2 = loadImage('assets/imgs/tree_shadow_2.png')
  img_shadow_3 = loadImage('assets/imgs/tree_shadow_3.png')

  img_water = loadImage('assets/imgs/water-ring.png')
  // img_water = loadImage('assets/imgs/water.png')
  // img_water_gradient = loadImage('assets/imgs/water-gradient.png')

  img_cream = loadImage('assets/imgs/cream.png')
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL)
  setAttributes('alpha', true)
  noFill()
  // Paramaters
  cam_tilt_degrees = 15

  // Cam setup
  cam = createCamera()
  cam.setPosition(0, -150, 500) // close-up
  angleMode(DEGREES)
  cam_tilt = cam.tilt(cam_tilt_degrees)

  // Colours
  background_colour = color('#efe8df')
  background_colour_RGB = color(239, 232, 223)
  orange_colour = color('#f46a42')

  //Typography
  textFont(font1)
  textSize(12)
  textAlign(CENTER, CENTER)

  // Add event listener to button
  document.getElementById('btn-calculate').onclick = function () {
    calculate()
  }

  // UI
  beef_input_a = document.getElementById('beef_input_a')
  beef_input_b = document.getElementById('beef_input_b')
  chicken_input_a = document.getElementById('chicken_input_a')
  chicken_input_b = document.getElementById('chicken_input_b')
  pork_input_a = document.getElementById('pork_input_a')
  pork_input_b = document.getElementById('pork_input_b')

  calculate_btn = document.getElementById('btn-calculate')

  // Display
  clear()
  background(background_colour)

  // Animation
  let FPS = 30
  frameRate(FPS)
  seconds_per_frame = 1 / FPS
  time_s = 0.0
  compute_complete = false
  init_animation()
}

// Animation loop
function draw() {
  clear()
  background(background_colour)

  if (compute_complete) {
    // Draw elements
    draw_grid_surface(animation, grid)

    draw_water(animation, ring)
    draw_tree(animation, tree)
    //draw_frame();
    //draw_water();
    //draw_tree();

    time_s += seconds_per_frame
  }
  if (time_s > animation_length) {
    noLoop()
  }
}

function windowResized() {
  resetCanvas()
}

function resetCanvas() {
  reset_animation_values()
  clear()
  loop()
  //setup()
}
