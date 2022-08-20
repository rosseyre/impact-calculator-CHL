// Module to store animation state
var animation, initial_values, animation_length

function init_animation() {
  initial_values = []

  animation = {
    grid: create_animation('y_limit', 0, 0, 2),
    water: create_animation('size', 100, 2, 7),
    // "tree": create_animation(variable, value, start, end),
    // "frame": create_animation(variable, value, start, end),
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

function create_animation(variable, init_value, start_time, end_time) {
  initial_values.push(init_value)

  return {
    variable: variable,
    value: init_value,
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
}
