// COMPUTE & DRAW SINGLE FRAMES

var grid, blocks_per_row, block_size, grid_centre_pixels, grid_width //Grid
var tree
var ring
var frame

function compute_elements() {
  grid = compute_grid(total_change.land)
  tree = compute_tree(total_change.c02)
  ring = compute_water(total_change.water)

  frame = compute_frame()

  compute_complete = true
}

// FARM GRID
function compute_grid(farmland_m2) {
  let x_squares = 16

  let m2_per_square = 4 // m^2 per rendered grid 'block'
  let square_size = createVector(
    draw_size.x / x_squares,
    draw_size.x / x_squares
  ) // square size in pixels

  let y_squares = farmland_m2 / x_squares / m2_per_square

  if (y_squares < x_squares) {
    // ensure min grid visualisation in the case of small values
    y_squares = x_squares
  }

  if (y_squares > x_squares * 3) {
    // cap y squares (processing)
    y_squares = x_squares * 3
  }

  grid_width = x_squares * square_size.x
  grid_centre_pixels = calculate_grid_centre(x_squares, square_size)

  let start_colour = color(100, 100, 100)
  let stroke_colour = start_colour
  colorMode(RGB)

  let grid_pos = createVector(
    grid_width / -2 - square_size.x / 2,
    frame_height / 2,
    0
  )

  let animation_inc =
    y_squares /
    (animation.grid_y_limit.end - animation.grid_y_limit.start) /
    frameRate()

  // COUNTER
  let counter_inc = round(
    farmland_m2 /
      (animation_length - animation.grid_y_limit.start) /
      frameRate()
  )
  let counter = 0
  let counter_pos = createVector(-grid_width * 0.5 + 10, grid_pos.y + 20, 0)

  return {
    animation_inc: animation_inc,
    counter_inc: counter_inc,
    counter: counter,
    counter_pos: counter_pos,
    farmland_m2: farmland_m2,
    grid_pos: grid_pos,
    x_squares: x_squares,
    y_squares: y_squares,
    square_size: square_size,
    grid_width: grid_width,
    stroke_colour: stroke_colour,
    start_colour: start_colour,
  }
}

function draw_grid(animation, grid) {
  if (time_s >= animation.grid_y_limit.start) {
    // controls when animation begins

    // draw counter
    display_counter(
      grid.counter_pos,
      grid.counter,
      'm??',
      'FARMLAND SAVED PER YEAR',
      'FOOTBALL FIELDS'
    )
    grid.counter = inc_counter(grid.counter, grid.counter_inc, grid.farmland_m2) //increment

    // draw grid
    push()
    translate(grid.grid_pos)

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
  let img_width = draw_size.x * 1.2
  let img_ratio = 1.3
  let img_height = img_width / img_ratio

  let tree_pos = createVector(
    80,
    grid.grid_pos.y - img_height / 2,
    grid.grid_pos.z - 100
  )

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

  // COUNTER
  let counter_inc = round(
    c02 / (animation_length - animation.tree_opacity.start) / frameRate()
  )
  let counter = 0
  let counter_pos = createVector(
    grid_width / 2 - 10,
    grid.grid_pos.y - grid_width - 5,
    0
  )

  return {
    animation_inc: animation_inc,
    counter_inc: counter_inc,
    counter: counter,
    counter_pos: counter_pos,
    c02: c02,
    tree_pos: tree_pos,
    tree_image: tree_image,
    shadow_image: shadow_image,
    img_width: img_width,
    img_height: img_height,
  }
}

function draw_tree(animation, tree) {
  if (time_s >= animation.tree_opacity.start) {
    // Draw counter
    display_counter(
      tree.counter_pos,
      tree.counter,
      'C0???',
      'SAVED IN A YEAR',
      'TREES'
    )

    tree.counter = inc_counter(tree.counter, tree.counter_inc, tree.c02) //increment

    // Shadow
    push()
    noStroke()
    noFill()

    //tint(255, animation.tree_opacity.value)
    translate(
      tree.tree_pos.x - 40,
      tree.tree_pos.y + tree.img_height / 2,
      tree.tree_pos.z - tree.img_height / 2 - 5
    )

    tint(0, animation.tree_opacity.value - animation.tree_opacity.value * 0.8)
    rotateX(90)
    texture(tree.shadow_image)
    plane(tree.img_width*1.2, tree.img_height)
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
  let diameter = draw_size.x * 0.42

  let init_pos = createVector(
    -55,
    grid.grid_pos.y - grid_width * 0.75,
    tree.tree_pos.z - 10 // behind tree
  )

  let animation_inc =
    animation.water_rotation.final_value /
    (animation.water_rotation.end - animation.water_rotation.start) /
    frameRate()

  // COUNTER
  let counter_inc = round(
    water / (animation_length - animation.tree_opacity.start) / frameRate()
  )
  let counter = 0
  let counter_pos = createVector(
    -grid_width * 0.32,
    grid.grid_pos.y - grid_width * 1.1,
    0
  )

  return {
    animation_inc: animation_inc,
    counter_inc: counter_inc,
    counter: counter,
    counter_pos: counter_pos,
    water: water,
    diameter: diameter,
    init_pos: init_pos,
  }
}

function draw_water(animation, ring) {
  if (time_s >= animation.water_rotation.start) {
    // Draw counter

    display_counter(ring.counter_pos, ring.counter, 'litres', 'WATER SAVED')
    ring.counter = inc_counter(ring.counter, ring.counter_inc, ring.water) //increment

    // Draw water
    push()
    noStroke()
    noFill()
    translate(-20, 0, 0)
    rotateZ(animation.water_rotation.value)
    translate(+20, 0, 0)
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
  let frame_width = grid_width - 20
  let total_dist = frame_width * 2 + frame_height * 2

  //frame vertices
  let v1 = createVector(frame_width / 2, frame_height / 2, tree.tree_pos.z - 40) // bottom right
  let v2 = createVector(
    -frame_width / 2,
    frame_height / 2,
    tree.tree_pos.z - 40
  ) // bottom left
  let v3 = createVector(
    -frame_width / 2,
    -frame_height / 2,
    tree.tree_pos.z - 40
  ) // top left
  let v4 = createVector(
    frame_width / 2,
    -frame_height / 2,
    tree.tree_pos.z - 40
  ) // top right

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
    strokeWeight(2.5)

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
      } else {
        beginShape()
      vertex(frame.v1.x, frame.v1.y, frame.v1.z)
      vertex(frame.v2.x, frame.v2.y, frame.v2.z)
      vertex(frame.v3.x, frame.v3.y, frame.v3.z)
      vertex(frame.v4.x, frame.v4.y, frame.v4.z)
      endShape(CLOSE)
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



function draw_title() {

  
    push()

    fill(text_colour)
    textAlign(LEFT)

    // HEADING
    textFont(font_bold)
    textSize(28)
    translate(-grid.grid_width * 0.5 + 25.5, -frame_height*0.7)
    text("YOUR +CHANGE", 1, 0)
  
    // Vert line
    strokeWeight(2)
    stroke(orange_colour)
    line(10, 25, 10, 80)

    // SUBHEADING
    textFont(font_med)
    textSize(14)
    text("VISUALISED IN A YEAR", 20, 72)

    pop()
  
    
}