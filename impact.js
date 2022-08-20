// CALCULATIONS

// Calculate total impact of change and generate the scene
function calculate(){
    beef_environmental_change = calculate_impact("beef", beef_input_a, beef_input_b);
    chicken_environmental_change = calculate_impact("chicken", chicken_input_a, chicken_input_b);
    pork_environmental_change = calculate_impact("pork", pork_input_a, pork_input_b);
    
    total_change = tally_impact(beef_environmental_change, chicken_environmental_change, pork_environmental_change);
    
    compute_elements(); // pre-compute necessary values for generated element
    //print_result();
    
  }
  
  // Given the animal protein type and the user's input, calculate & return an object containing the environmental impacts of the dietary change
  function calculate_impact(type, input_a, input_b) {
    
    let change = {
      "land": 0,
      "c02": 0,
      "water": 0
    }
    
    let delta = slider_input_delta(input_a, input_b);
    
    
    switch(type) {
    case "beef":
      change.land = BEEF_LAND*delta;
      change.c02 = BEEF_C02*delta;
      change.water = BEEF_WATER*delta;
      break;
    case "chicken":
      change.land = CHICKEN_LAND*delta;
      change.c02 = CHICKEN_C02*delta;
      change.water = CHICKEN_WATER*delta;
      break;
    case "pork":
      change.land = PORK_LAND*delta;
      change.c02 = PORK_C02*delta;
      change.water = PORK_WATER*delta;
      break;
    default:
      console.log("Animal not found.");
  }
    
    //console.log(type + ": " + delta);
    
    return change;
    
  }
  
  function tally_impact(beef, chicken, pork) {
    return {
      "land": round(beef.land + chicken.land + pork.land),
      "c02": round(beef.c02 + chicken.c02 + pork.c02),
      "water": round(beef.water + chicken.water + pork.water)
    }
  }
  
  // Take slider range inputs and the calculate difference
  function slider_input_delta(rangeA, rangeB){
    let delta = rangeB.value - rangeA.value;
    if(delta<0) {
      delta*=-1;
    }
    return delta;
  }
  
  