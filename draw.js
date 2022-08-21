// COMPUTE & DRAW SINGLE FRAMES

var grid, blocks_per_row, block_size, grid_centre_pixels //Grid
var tree, ring

function compute_elements() {
  //reset_animation_values()

  // Compute elements once
  grid = compute_grid_surface(total_change.land)
  tree = compute_tree(total_change.c02)
  ring = compute_water(total_change.water)

  compute_complete = true
}

// FARM GRID
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

function draw_grid_surface(animation, grid) {
  if (time_s >= animation.grid_y_limit.start) {
    // controls when animation begins
    let animation_inc =
      grid.y_squares /
      (animation.grid_y_limit.end - animation.grid_y_limit.start) /
      frameRate()

    push()
    translate(grid.grid_width_pixels / -2 - grid.square_size.x / 2, 0, 0) // move grid to centre

    noFill()
    strokeWeight(0.4)
    for (let x = grid.x_squares - 1; x > 0; x--) {
      // x-axis
      for (let y = 1; y <= grid.y_squares; y++) {
        // y-axis

        if (animation.grid_y_limit.value >= y) {
          // set y limit for animation
          beginShape()
          if (y > grid.x_squares) {
            grid.stroke_colour = lerpColor(
              grid.start_colour,
              background_colour_RGB,
              y / grid.y_squares
            )
          } else {
            grid.stroke_colour = grid.start_colour
          }

          stroke(grid.stroke_colour)
          vertex(x * grid.square_size.x, 0, -y * grid.square_size.y)
          vertex((x + 1) * grid.square_size.x, 0, -y * grid.square_size.y)

          vertex(
            (x + 1) * grid.square_size.x,
            0,
            -1 * (y - 1) * grid.square_size.y
          )
          vertex(x * grid.square_size.x, 0, -1 * (y - 1) * grid.square_size.y)

          endShape(CLOSE)
        }
      }
    }
    pop()

    if (time_s < animation.grid_y_limit.end) {
      animation.grid_y_limit.value += animation_inc // add some increment determined from the animation length and min+max value
    }
  }
}

// TREE
function compute_tree(c02) {
  // size
  let img_width = width * 0.3
  let img_ratio = 1.2
  let img_height = img_ratio * img_width

  // tree type
  let inc = round(C02_MAX / 3)
  let tree_type

  if (c02 <= inc) {
    tree_type = img_tree_1
  } else if (c02 <= inc * 2) {
    tree_type = img_tree_2
  } else {
    tree_type = img_tree_3
  }

  return { tree_type: tree_type, img_width: img_width, img_height: img_height }
}

function draw_tree(animation, tree) {
  if (time_s >= animation.tree_opacity.start) {
    let animation_inc =
      255 /
      (animation.tree_opacity.end - animation.tree_opacity.start) /
      frameRate()

    push()
    noStroke()
    noFill()
    tint(255, animation.tree_opacity.value)

    
    textureMode(IMAGE)
    texture(tree.tree_type)
    
    translate(0, grid_centre_pixels.y, grid_centre_pixels.z) // move to centre
    translate(10, -tree.img_height / 2, 0) // move to ground level
    translate(50, 0, -grid_centre_pixels.z / 2) // offset
    plane(tree.img_width, tree.img_height)
    pop()

    // Increment animation value
    if (animation.tree_opacity.value < 255) {
      animation.tree_opacity.value += animation_inc
    }

    // Bring back png transparency
    if (time_s >= animation.tree_opacity.end) {
      push()
      noTint()
      pop()
    }
  }
}

// WATER

function compute_water(water) {
  // size
  let outer_ring_size = width * 0.2
  let inner_ring_size = map(
    water,
    0,
    WATER_MAX,
    outer_ring_size * 0.95,
    outer_ring_size * 0.7
  )

  let init_pos = createVector(
    grid_centre_pixels.x - 200,
    -outer_ring_size - 80,
    grid_centre_pixels.z - 10
  )

  let max_angle = 20

  return {
    outer_ring_size: outer_ring_size,
    inner_ring_size,
    inner_ring_size,
    init_pos: init_pos,
    max_angle: max_angle,
  }
}

function draw_water(animation, ring) {
  if (time_s >= animation.water_rotation.start) {
    let animation_inc =
      ring.max_angle /
      (animation.water_rotation.end - animation.water_rotation.start) /
      frameRate()

    push()
    noStroke()

    rotateX(cam_tilt_degrees)
    //translate(grid_centre_pixels.x, -outer_circle_size, grid_centre_pixels.z) // move to centre
    translate(ring.init_pos)
    //rotate(animation.water_rotation)
    texture(img_water_gradient)
    torus(
      ring.outer_ring_size / 2,
      (ring.outer_ring_size - ring.inner_ring_size) / 2,
      36,
      4
    )
    pop()

    if (animation.water_rotation.value < ring.max_angle) {
      //animation.water_rotation.value += animation_inc
    }
  }
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
