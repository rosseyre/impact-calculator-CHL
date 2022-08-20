// COMPUTE & DRAW SINGLE FRAMES

var grid, blocks_per_row, block_size, grid_centre_pixels //Grid

function compute_elements() {
  reset_animation_values()

  // Compute elements once
  grid = compute_grid_surface(total_change.land)

  compute_complete = true
}

function compute_grid_surface(farmland_m2) {
  let m2_per_square = 4 // m^2 per rendered grid 'block'
  let square_size = createVector(width / 24, width / 24) // square size in pixels
  noiseDetail(1, 0.01)

  let x_squares = 16
  //let x_squares = Math.round(Math.sqrt(farmland_m2) / m2_per_square);
  let y_squares = farmland_m2 / x_squares / m2_per_square

  if (y_squares < x_squares) {
    // ensure min grid visualisation in the case of small values
    y_squares = x_squares
  }

  let grid_width_pixels = calculate_grid_width(x_squares, square_size)
  grid_centre_pixels = calculate_grid_centre(x_squares, square_size)

  let start_colour = color(100, 100, 100)
  let stroke_colour = start_colour
  colorMode(RGB)

  return {
    x_squares: x_squares,
    y_squares: y_squares,
    square_size: square_size,
    grid_width_pixels: grid_width_pixels,
    stroke_colour: stroke_colour,
    start_colour: start_colour,
  }
}

function draw_grid_surface(
  animation,
  x_squares,
  y_squares,
  square_size,
  grid_width_pixels,
  stroke_colour,
  start_colour
) {
  if (animation.grid.start <= time_s) {
    // controls when animation begins
    let animation_inc =
      y_squares / (animation.grid.end - animation.grid.start) / frameRate()

    push()
    translate(grid_width_pixels / -2 + square_size.x / 2, 0, 0) // move grid to centre

    noFill()
    strokeWeight(0.4)
    for (let x = x_squares - 1; x > 0; x--) {
      // x-axis
      for (let y = 1; y <= y_squares; y++) {
        // y-axis

        if (animation.grid.value >= y) {
          // set y limit for animation
          beginShape()
          if (y > x_squares) {
            stroke_colour = lerpColor(
              start_colour,
              background_colour_RGB,
              y / y_squares
            )
          } else {
            stroke_colour = start_colour
          }

          stroke(stroke_colour)
          vertex(x * square_size.x, 0, -y * square_size.y)
          vertex((x + 1) * square_size.x, 0, -y * square_size.y)

          vertex((x + 1) * square_size.x, 0, -1 * (y - 1) * square_size.y)
          vertex(x * square_size.x, 0, -1 * (y - 1) * square_size.y)

          endShape(CLOSE)
        }
      }
    }
    pop()

    if (time_s < animation.grid.end) {
      animation.grid.value += animation_inc // add some increment determined from the animation length and min+max value
    }
  }
}

function draw_tree(c02) {
  // let size = map(c02, 0, C02_MAX, width*0.15, width*0.4); // map(value, start1, stop1, start2, stop2, [withinBounds])
  let size = width * 0.3
  let img_ratio = 1.2
  let img_width = size
  let img_height = img_ratio * size

  push()
  noStroke()
  noFill()
  texture(img_tree_1)
  translate(grid_centre_pixels.x, grid_centre_pixels.y, grid_centre_pixels.z) // move to centre
  translate(0, -img_height / 2, 0) // move to ground level
  translate(50, 0, -grid_centre_pixels.z / 2) // offset
  plane(img_width, img_height)

  pop()
}

function draw_water(water) {
  let outer_circle_size = width * 0.2
  let inner_circle_size = map(
    water,
    0,
    WATER_MAX,
    outer_circle_size * 0.95,
    outer_circle_size * 0.7
  )

  push()
  noStroke()

  rotateX(cam_tilt_degrees)
  translate(grid_centre_pixels.x, -outer_circle_size, grid_centre_pixels.z) // move to centre
  translate(-10, -80, 0) // offset
  texture(img_water_gradient)
  torus(
    outer_circle_size / 2,
    (outer_circle_size - inner_circle_size) / 2,
    36,
    4
  )

  //   //water circle
  //   translate(grid_centre_pixels.x-25, -grid_centre_pixels.x, grid_centre_pixels.z);
  //   texture(img_water);
  //   plane(outer_circle_size, outer_circle_size);

  //   // inner circle
  //   translate(0, 0, 1);
  //   texture(img_cream);
  //   ellipse(0, 0, inner_circle_size, inner_circle_size);

  pop()
}

function draw_frame() {
  push()
  translate(
    grid_centre_pixels.x / 2,
    grid_centre_pixels.y,
    grid_centre_pixels.z
  ) // move to centre
  translate(0, -200, 1) // move to position
  stroke(orange_colour)
  strokeWeight(4)
  square(0, 0, 200)
  pop()
}
