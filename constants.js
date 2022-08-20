/* Yearly environmental impacts per 85g serving of animal protein produced

Source: 
https://coda.io/d/_dUhotgCQB2s/Interactive-Piec44Story-of-Soy_su_KZ

*/

// BEEF
const BEEF_LAND = 1441.8; // m^2/year
const BEEF_GRAIN = 506; // kg/year
const BEEF_C02 = 441.8; // kg/year
const BEEF_C02_TREES = 17; // trees/year
const BEEF_WATER = 68068; // litres/year

// CHICKEN
const CHICKEN_LAND = 53.9; // m^2/year
const CHICKEN_GRAIN = 19; // kg/year
const CHICKEN_C02 = 43.3; // kg/year
const CHICKEN_C02_TREES = 2; // trees/year
const CHICKEN_WATER = 19006; // litres/year

// PORK
const PORK_LAND = 76.9; // m^2/year
const PORK_GRAIN = 27; // kg/year
const PORK_C02 = 50.8; // kg/year
const PORK_C02_TREES = 17; // trees/year
const PORK_WATER = 26520; // litres/year



// Min/Max (for range mapping)
const LAND_MAX = 15726;
const C02_MAX = 5359;
const WATER_MAX = 1135940;
