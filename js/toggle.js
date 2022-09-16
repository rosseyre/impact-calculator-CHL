const img_path_beef = 'assets/imgs/beef-production.png'
const img_path_soy = 'assets/imgs/soy-production.png'

var img_path = img_path_beef // default

const toggle_switch = document.querySelector('.toggle-switch')
const toggle_image = document.querySelector('.toggle-image')

toggle_switch.addEventListener('change', (e) => {
  if (e.target.checked) {
    toggle_image.src = img_path_soy
  } else {
    toggle_image.src = img_path_beef
  }
})
