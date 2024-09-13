const keys = {}

export const keydown = (key) => {
  //console.log(event)
  if (!keys[key]) keys[key] = {}

  // already down
  if (keys[key].down) return
  //console.log("keydown", event)
  //console.log('key down', event.key)

  keys[key].justUp = false
  keys[key].down = true
  keys[key].justDown = true
}

export const keyup = (key) => {
  if (!keys[key]) return
  //console.log("keyup", event)
  //console.log("key up", event.key)

  keys[key].justUp = true
  keys[key].down = false
  keys[key].justDown = false
}

document.addEventListener('keydown', (event) => {
  keydown(event.key)
})

document.addEventListener('keyup', (event) => {
  keyup(event.key)
})

export default keys
