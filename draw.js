// COMPUTE & DRAW SINGLE FRAMES

var grid, blocks_per_row, block_size, grid_centre_pixels, grid_width //Grid
var tree
var ring
var frame

function compute_elements() {
  grid = compute_grid_surface(total_change.land)
  tree = compute_tree(total_change.c02)
  ring = compute_water(total_change.water)

  frame = compute_frame()

  compute_complete = true
}

// FARM GRID
function compute_grid_surface(farmland_m2) {
  let x_squares = 16

  let m2_per_square = 4 // m^2 per rendered grid 'block'
  let square_size = createVector(
    (width * 0.5) / x_squares,
    (width * 0.5) / x_squares
  ) // square size in pixels

  //let x_squares = Math.round(Math.sqrt(farmland_m2) / m2_per_square);
  let y_squares = farmland_m2 / x_squares / m2_per_square

  if (y_squares < x_squares) {
    // ensure min grid visualisation in the case of small values
    y_squares = x_squares
  }

  if (y_squares > x_squares * 3) {
    // cap y squares (processing)
    y_squares = x_squares * 3
  }

  grid_width = calculate_grid_width(x_squares, square_size)
  grid_centre_pixels = calculate_grid_centre(x_squares, square_size)

  let start_colour = color(100, 100, 100)
  let stroke_colour = start_colour
  colorMode(RGB)

  let animation_inc =
    y_squares /
    (animation.grid_y_limit.end - animation.grid_y_limit.start) /
    frameRate()

  return {
    animation_inc: animation_inc,
    x_squares: x_squares,
    y_squares: y_squares,
    square_size: square_size,
    grid_width: grid_width,
    stroke_colour: stroke_colour,
    start_colour: start_colour,
  }
}

function draw_grid_surface(animation, grid) {
  if (time_s >= animation.grid_y_limit.start) {
    // controls when animation begins

    push()
    translate(grid.grid_width / -2 - grid.square_size.x / 2, 0, 0) // move grid to centre

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
      animation.grid_y_limit.value += grid.animation_inc // add some increment determined from the animation length and min+max value
    }
  }
}

// TREE
function compute_tree(c02) {
  // size
  let img_width = width * 0.45
  let img_ratio = 1.3
  let img_height = img_width / img_ratio

  let tree_pos = createVector(50, -img_height / 2, -100)

  // tree type
  let inc = round(C02_MAX / 3)
  let tree_image, shadow_image

  if (c02 <= inc) {
    tree_image = img_tree_1
    shadow_image = img_shadow_1
  } else if (c02 <= inc * 2) {
    tree_image = img_tree_2
    shadow_image = img_shadow_2
  } else {
    tree_image = img_tree_3
    shadow_image = img_shadow_3
  }

  let animation_inc =
    animation.tree_opacity.final_value /
    (animation.tree_opacity.end - animation.tree_opacity.start) /
    frameRate()

  return {
    animation_inc: animation_inc,
    tree_pos: tree_pos,
    tree_image: tree_image,
    shadow_image: shadow_image,
    img_width: img_width,
    img_height: img_height,
  }
}

function draw_tree(animation, tree) {
  if (time_s >= animation.tree_opacity.start) {
    // shadow perspective
    // push()
    // stroke(0)
    // texture(tree.tree_image)
    // //tint(255, animation.tree_opacity.value)
    // //tint(0, animation.tree_opacity.value - animation.tree_opacity.value * 0.8)
    // beginShape()
    // vertex(tree.tree_pos.x, tree.tree_pos.y, -tree.tree_pos.z) //bottom left
    // vertex(tree.tree_pos.x + tree.img_width, tree.tree_pos.y, -tree.tree_pos.z) // bottom right
    // vertex(
    //   tree.tree_pos.x - tree.img_width / 2,
    //   tree.tree_pos.y,
    //   tree.tree_pos.z - tree.img_height
    // ) // top right
    // vertex(
    //   tree.tree_pos.x - tree.img_width,
    //   tree.tree_pos.y,
    //   tree.tree_pos.z - tree.img_height
    // ) // top left

    // endShape(CLOSE)

    //pop()

    // shadow 2 plane version
    push()
    noStroke()
    noFill()

    tint(255, animation.tree_opacity.value)
    // translate(50, grid_centre_pixels.y, grid_centre_pixels.z * 2 + 30)
    translate(tree.tree_pos.x, 0, tree.tree_pos.z - tree.img_height)
    rotateX(90)
    //tint(0, animation.tree_opacity.value)
    tint(0, animation.tree_opacity.value - animation.tree_opacity.value * 0.8)
    texture(tree.tree_image)
    plane(tree.img_width * 1.6, tree.img_height * 2)
    pop()

    // Tree
    push()
    noStroke()
    noFill()
    tint(255, animation.tree_opacity.value)
    translate(tree.tree_pos)

    texture(tree.tree_image)
    plane(tree.img_width, tree.img_height)
    pop()

    // Increment animation value
    if (animation.tree_opacity.value <= animation.tree_opacity.final_value) {
      animation.tree_opacity.value += tree.animation_inc
    }
  }
}

// WATER

function compute_water(water) {
  // size
  let diameter = width * 0.2

  let init_pos = createVector(
    -80,
    -diameter - 50,
    tree.tree_pos.z - 10 // behind tree
  )

  let animation_inc =
    animation.water_rotation.final_value /
    (animation.water_rotation.end - animation.water_rotation.start) /
    frameRate()

  return {
    animation_inc: animation_inc,
    diameter: diameter,
    init_pos: init_pos,
  }
}

function draw_water(animation, ring) {
  if (time_s >= animation.water_rotation.start) {
    push()
    noStroke()
    noFill()
    rotateZ(animation.water_rotation.value)
    translate(ring.init_pos)

    texture(img_water)
    plane(ring.diameter, ring.diameter)

    pop()

    if (animation.water_rotation.value < animation.water_rotation.final_value) {
      animation.water_rotation.value += ring.animation_inc
    }
  }
}

// WINDOW FRAME

function compute_frame() {
  let ratio = 1.4
  //frame vertices
  let v1 = createVector(grid_width / 2, 0, tree.tree_pos.z) // bottom right
  let v2 = createVector(-grid_width / 2, 0, tree.tree_pos.z) // bottom left
  let v3 = createVector(-grid_width / 2, -grid_width * ratio, tree.tree_pos.z) // top left
  let v4 = createVector(grid_width / 2, -grid_width * ratio, tree.tree_pos.z) // top right

  let frame_width = grid_width
  let frame_height = grid_width * ratio
  let total_dist = frame_width * 2 + frame_height * 2

  // calculate turn points as fractions of whole
  let turn1 = (frame_width / total_dist) * 100 // bottom left
  let turn2 = ((frame_width + frame_height) / total_dist) * 100 // top left
  let turn3 = ((frame_width * 2 + frame_height) / total_dist) * 100 // TOP RIGHT

  // determine animation increment
  let animation_inc =
    animation.frame_limit.final_value /
    (animation.frame_limit.end - animation.frame_limit.start) /
    frameRate()

  return {
    animation_inc: animation_inc,
    total_dist: total_dist,
    frame_width: frame_width,
    frame_height: frame_height,
    v1: v1,
    v2: v2,
    v3: v3,
    v4: v4,
    turn1: turn1,
    turn2: turn2,
    turn3: turn3,
  }
}

function draw_frame(animation, frame) {
  if (time_s >= animation.frame_limit.start) {
    push()
    stroke(orange_colour)
    strokeWeight(2)

    if (time_s < animation.frame_limit.end) {
      // if animating
      let head = frame.v1.copy()
      // DRAW FRAME
      beginShape()
      vertex(frame.v1.x, frame.v1.y, frame.v1.z) // add first vertex

      // turns
      if (animation.frame_limit.value <= frame.turn1) {
        // head is tracking base

        let minValue = 0
        let maxValue = frame.turn1
        let range = maxValue - minValue

        let l = (animation.frame_limit.value / range) * frame.frame_width
        head.x = frame.v1.x - l
        vertex(head.x, head.y, head.z)
      } else if (animation.frame_limit.value <= frame.turn2) {
        // head is tracking left side (up)
        head.x = frame.v2.x
        vertex(frame.v2.x, frame.v2.y, frame.v2.z)

        let minValue = frame.turn1
        let maxValue = frame.turn2
        let range = maxValue - minValue

        let l =
          ((animation.frame_limit.value - minValue) / range) *
          frame.frame_height
        head.y = frame.v2.y - l

        vertex(head.x, head.y, head.z)
      } else if (animation.frame_limit.value <= frame.turn3) {
        // head is tracking top (right)
        head.y = frame.v3.y
        vertex(frame.v2.x, frame.v2.y, frame.v2.z)
        vertex(frame.v3.x, frame.v3.y, frame.v3.z)

        let minValue = frame.turn2
        let maxValue = frame.turn3
        let range = maxValue - minValue
        let l =
          ((animation.frame_limit.value - minValue) / range) * frame.frame_width
        head.x = frame.v3.x + l

        vertex(head.x, head.y, head.z)
      } else if (animation.frame_limit.value < 100) {
        // head is tracking right (returning to v1)
        head.x = frame.v4.x
        vertex(frame.v2.x, frame.v2.y, frame.v2.z)
        vertex(frame.v3.x, frame.v3.y, frame.v3.z)
        vertex(frame.v4.x, frame.v4.y, frame.v4.z)

        let minValue = frame.turn3
        let maxValue = animation.frame_limit.final_value
        let range = maxValue - minValue

        let l =
          ((animation.frame_limit.value - minValue) / range) *
          frame.frame_height
        head.y = frame.v3.y + l

        vertex(head.x, head.y, head.z)
      } else {
        vertex(frame.v1.x, frame.v1.y, frame.v1.z)
      }
      endShape()

      if (animation.frame_limit.value <= animation.frame_limit.final_value) {
        animation.frame_limit.value += frame.animation_inc
      }
    } else {
      beginShape()
      vertex(frame.v1.x, frame.v1.y, frame.v1.z)
      vertex(frame.v2.x, frame.v2.y, frame.v2.z)
      vertex(frame.v3.x, frame.v3.y, frame.v3.z)
      vertex(frame.v4.x, frame.v4.y, frame.v4.z)
      endShape(CLOSE)
    }
    pop()
  }
}
