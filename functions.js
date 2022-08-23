// Supplementary functions

function calculate_grid_centre(squares_per_row, square_size) {
  // returns 3D vector corresponding to centre of surface of grid

  let half_grid = (squares_per_row / 2) * square_size.x
  return createVector(half_grid, 0, -half_grid)
}

function calculate_grid_width(squares_per_row, square_size) {
  // in pixels
  let grid_width_pixels = squares_per_row * square_size.x
  return grid_width_pixels
}

//logging
function print_result() {
  console.log('POSITIVE ENVIRONMENTAL CHANGE')

  console.log('Results (Total):')
  console.log('Land: ' + total_change.land + ' m^2/year')
  console.log('C02: ' + total_change.c02 + ' kg/year')
  console.log('Water: ' + total_change.water + ' litres/year')

  console.log('---------------')

  console.log()
  console.log('BEEF:')
  console.log('Land: ' + beef_environmental_change.land + ' m^2/year')
  console.log('C02: ' + beef_environmental_change.c02 + ' kg/year')
  console.log('Water: ' + beef_environmental_change.water + ' litres/year')

  console.log()
  console.log('CHICKEN:')
  console.log('Land: ' + chicken_environmental_change.land + ' m^2/year')
  console.log('C02: ' + chicken_environmental_change.c02 + ' kg/year')
  console.log('Water: ' + chicken_environmental_change.water + ' litres/year')

  console.log()
  console.log('PORK:')
  console.log('Land: ' + pork_environmental_change.land + ' m^2/year')
  console.log('C02: ' + pork_environmental_change.c02 + ' kg/year')
  console.log('Water: ' + pork_environmental_change.water + ' litres/year')
}
