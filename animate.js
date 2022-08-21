// Module to store animation state
var animation, initial_values, animation_length

function init_animation() {
  initial_values = []

  animation = {
    grid_y_limit: create_animation(0, 0, 0, 2),
    tree_opacity: create_animation(0, 255, 1, 1.5), // time with frame
    water_rotation: create_animation(0, 20, 1.5, 3),
    // "tree": create_animation(value, start, end),
    // "frame": create_animation(value, start, end),
    // "title": create_animation(variable, value, start, end),
    // "labels": create_animation(variable, value, start, end)
  }

  // determine total animation duration
  animation_length = 0
  for (const [key, element] of Object.entries(animation)) {
    if (animation_length < element.end) {
      animation_length = element.end
    }
  }
}

function create_animation(init_value, final_value, start_time, end_time) {
  initial_values.push(init_value)

  return {
    value: init_value,
    final_value: final_value,
    start: start_time, // ms
    end: end_time, // ms
  }
}

function reset_animation_values() {
  let i = 0
  for (const [key, element] of Object.entries(animation)) {
    element.value = initial_values[i]
    i++
  }
  time_s = 0
}
