import keys, { keydown, keyup } from './input'

export default (game) => {
  const elKeyboard = document.createElement('div')

  elKeyboard.classList.add('v-keys')

  elKeyboard.innerHTML = `
    <div class="v-keys-set-1">
      <div class="up">^</div>
      <div class="down">^</div>
      <div>X</div>
      <div>A</div>
      <div>L</div>
      <div>K</div>
    </div>
    <div class="v-keys-set-2">
      <div>Q</div>
      <div>W</div>
      <div>E</div>
      <div>R</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
    </div>
  `

  game.el.appendChild(elKeyboard)

  elKeyboard.querySelectorAll(':scope > div > div').forEach((el) => {
    let mappedKey = el.innerText.toLowerCase()

    if (mappedKey === '^') mappedKey = 'ArrowUp'
    if (el.classList.contains('down')) mappedKey = 'ArrowDown'

    el.addEventListener('pointerdown', (event) => {
      event.preventDefault()

      console.log('pointer down', el)
      console.dir(el)
      console.log('key text', el.innerText)

      console.log('mapped key', mappedKey, keys[mappedKey])

      el.classList.add('active')

      keydown(mappedKey)
    })

    el.addEventListener('pointerup', (event) => {
      event.preventDefault()
      console.log('pointer up', el)

      el.classList.remove('active')

      keyup(mappedKey)
    })
  })
}
