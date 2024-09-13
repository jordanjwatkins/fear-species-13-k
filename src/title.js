export default function title() {
  console.log('title')

  const elTitleWrap = document.createElement('div')

  elTitleWrap.classList.add('title-wrap')

  document.body.appendChild(elTitleWrap)

  elTitleWrap.innerHTML = `
    <div class="title">
      <div class="fear title-word">Fear</div>

      <div class="species title-word">Species 13K</div>

      <div class="tank-wrap">
        <div class="tank">
          <div class="top"></div>
          <div class="bottom"></div>

          <div class="specimen">
            <div class="head">
               <div class="eye l"></div>
               <div class="eye r"></div>
            </div>
            <div class="body"></div>
          </div>

          <div class="tube"></div>
          <div class="tube-2"></div>
          <div class="hookup"></div>
        </div>

      </div>
      <div class="tank-over"></div>
    </div>
      <div class="top-lid lid"></div>
      <div class="bottom-lid lid"></div>
  `

  let started = false

  const startGame = () => {
    if (started) return

    started = true
    console.log('title click')

    const els = document.querySelectorAll('.lid')

    els.forEach((el) => {
      el.classList.add('closed')
    })

    setTimeout(() => {
      document.querySelector('.title').classList.add('hide')
    }, 500)

    setTimeout(() => {
      els.forEach((el) => {
        el.classList.remove('closed')
      })
    }, 1000)
  }

  setTimeout(() => {
    const elTitle = document.querySelector('.title')

    elTitle.addEventListener('click', startGame, { once: true })
    elTitle.addEventListener('pointerup', startGame, { once: true })
    document.body.addEventListener('keyup', startGame, { once: true })
  }, 3000)
}
