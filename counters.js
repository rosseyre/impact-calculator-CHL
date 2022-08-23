function display_counter(
  position,
  value_primary,
  units_primary,
  label_primary
) {
  push()

  fill(text_colour)
  textAlign(LEFT)

  // Main value
  textFont(font_bold)
  textSize(22)
  //let s = concat(toString(value_primary), units_primary)
  text(value_primary + units_primary, position.x, position.y)
  // units
  //text(units_primary, position.x, position.y)

  // bottom desc
  textFont(font_reg)
  textSize(12)
  text(label_primary, position.x, position.y + 30)

  pop()
}
