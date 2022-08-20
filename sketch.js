var time_s, seconds_per_frame
var cam, cam_tilt
var compute_complete
var img_tree_1, img_water, img_water_gradient, img_cream
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
  img_water = loadImage('assets/imgs/water.png')
  img_water_gradient = loadImage('assets/imgs/water-gradient.png')

  img_cream = loadImage('assets/imgs/cream.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)

  // Paramaters
  let animation_length = 5
  cam_tilt_degrees = 20

  // Cam setup
  cam = createCamera()
  cam.setPosition(0, -200, 500) // close-up
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

  // Calculate using default UI inputs (*remove in production)
  //calculate();
}

// Animation loop
function draw() {
  clear()
  background(background_colour)

  if (compute_complete) {
    if (time_s < animation_length) {
      // Draw elements
      draw_grid_surface(
        animation.grid.value,
        grid.x_squares,
        grid.y_squares,
        grid.square_size,
        grid.grid_width_pixels,
        grid.stroke_colour,
        grid.start_colour
      )
      //draw_frame();
      //draw_water();
      //draw_tree();
    }
  }
}
