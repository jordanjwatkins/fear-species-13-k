export default (game) => {
  const el = document.createElement('div')

  el.classList.add('end')

  document.body.appendChild(el)

  el.innerHTML = `
    <div class="outro-text">The head of species 13k has been removed. Now it is they who will fear.</div>

    <div class="created-by">Created by Jordan J Watkins for JS13K 2024</div>
  `

  //document.body.innerHTML += `<div class="command-center"></div><div class="boom"></div><div class="pulse"></div>`

  return {
    el,
    show() {
      console.log('show', el.classList)

      this.el.classList.add('show')
      console.log('show', el.classList)

      const elCanvas = document.querySelector('canvas')
      const context = elCanvas.getContext('2d')

      console.log('ste', game.fx.canvas)
      context.fillStyle = '#fff'

      for (let i = 0; i < 400; i++) {
        const x = Math.random() * document.body.clientWidth
        const y = Math.random() * document.body.clientHeight
        const radius = Math.random() * 2

        context.beginPath()
        context.arc(x, y, radius, 0, 2 * Math.PI, false)
        context.fill()
      }

      //game.fx.canvas.style.zIndex = '9000'

      elCanvas.style.zIndex = '9000'
      //document.body.appendChild(game.fx.canvas)

      const elText = document.createElement('div')

      elText.innerHTML = `<div class="command-center"></div><div class="boom"></div><div class="pulse"></div>`

      Array.from(elText.children).forEach((element) => {
        document.body.appendChild(element)
      })

      setTimeout(() => {
        document.querySelector('.command-center').style.display = 'none'
      }, 1600)
    },
  }
}
