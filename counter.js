function display_counter(
  pos,
  value_primary,
  units_primary,
  label_primary,
  label_secondary
) {
  push()

  fill(text_colour)
  textAlign(LEFT)

  // LABEL TOP

  // Main value
  textFont(font_bold)
  textSize(20)
  //let s = concat(toString(value_primary), units_primary)
  text(value_primary + ' ' + units_primary, pos.x, pos.y)
  // units
  //text(units_primary, pos.x, pos.y)

  // desc
  textFont(font_reg)
  textSize(12)
  text(label_primary, pos.x, pos.y + 25)

  // LABEL BOTTOM (Optional)

  if (label_secondary) {
    // vertical line
    strokeWeight(1.5)
    stroke(orange_colour)
    line(pos.x, pos.y + 40, pos.x, pos.y + 80)

    let eq = 1
    switch (label_secondary) {
      case 'FOOTBALL FIELDS':
        eq = M2_FOOTBALL_FIELD
        break
      case 'TREES':
        eq = C02_PER_YEAR_PER_TREE
    }

    fill(orange_colour)
    textFont(font_med)
    text(
      '~' + round((value_primary / eq) * 10) / 10 + ' ' + label_secondary,
      pos.x + 10,
      pos.y + 72
    )
  }

  pop()
}

function inc_counter(value, inc, max) {
  if (value < max) {
    return value + inc
  } else {
    return max
  }
}
