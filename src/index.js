import './styles/app.css'
import keys from './input'
import orderList from './order-list'
import GameLoop from './libs/GameLoop'
import workspace from './workspace'
import orderParts from './order-parts'
import ImageFx from './libs/ImageFx'
import title from './title'
import audio from './audio'
import shiftSelect from './shift-select'
import vKeys from './v-keys'
import end from './end'
import Storage from './libs/Storage'

// Live Reload
new EventSource('/esbuild').addEventListener('change', () => location.reload())

const game = {
  el: document.createElement('div'),
  roundRecord: {
    good: 0,
    ok: 0,
    bad: 0,
  },
  currentOrderIndex: null,
  storage: new Storage('fear-species-13'),
}

game.storage.load()

console.log('loaded state', game.storage.state)

game.el.classList.add('game-wrap')

document.body.appendChild(game.el)

// Scan lines
/*{
  const elScanLines = document.createElement('div')
  elScanLines.classList.add('scan-lines-2')
  document.body.append(elScanLines)
}*/

/*{
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const elBubble = document.createElement('div')

      elBubble.classList.add('bubble')
      elBubble.innerHTML = '<div></div>'

      elBubble.style.left = `${(document.body.clientWidth / 15) * i + 20}px`
      //elBubble.style.left = `${20}px`

      document.body.appendChild(elBubble)
    }, 500 * i + 15000 * Math.random())
  }
}*/

game.orderList = orderList(game)
game.workspace = workspace(game)
game.shiftSelect = shiftSelect(game)
game.orderParts = orderParts(game)
game.vKeys = vKeys(game)

game.orderParts.disableAll()

game.selectOrder = (recipe, index) => {
  console.log('selected order', recipe)

  game.shiftSelect.elShiftHeader
    .querySelector('.duty-select-prompt')
    .classList.remove('show')

  game.orderParts.disableAll()

  game.currentRecipe = { ...recipe }
  game.currentOrderIndex = index
  game.workspace.elRecipeProgressInstructions.innerHTML = `Task: ${recipe.displayName}`
  game.workspace.el.classList.add('active-order')
  game.orderParts.populateIngredients()

  game.currentRecipe.patience = 200
  game.currentRecipe.onStart(game)

  game.orderParts.showWorkFlash()
}

game.gameLoop = new GameLoop(() => {
  game.orderList.update(game)
  game.orderParts.update(game)
  game.workspace.update(game)
  game.shiftSelect.update()

  for (const [key, state] of Object.entries(keys)) {
    state.justDown = false
    state.justUp = false
  }
})

// Canvas Effects and scaling / orientation adjustments
const canvas = document.createElement('canvas')
{
  document.body.appendChild(canvas)

  const fx = new ImageFx(canvas, canvas.getContext('2d'))

  //canvas.style.zIndex = 9000

  const scaleAndOrient = () => {
    const screenWidth = document.body.clientWidth
    const screenHeight = document.body.clientHeight

    canvas.width = screenWidth
    canvas.height = screenHeight

    setTimeout(() => {
      if (game.end.el.classList.contains('show')) {
        //context.fillStyle = '#fff'
        //context.fillRect(0, 0, 100, 100)
      } else {
        fx.vignette()
      }
      //fx.noise(0, 0)
    }, 500)

    if (screenWidth / screenHeight > 1000 / 800) {
      document.documentElement.style.setProperty(
        '--game-scale',
        screenHeight / 900
      )

      game.el.classList.add('landscape')
    } else {
      document.documentElement.style.setProperty(
        '--game-scale',
        screenWidth / 1100
      )

      game.el.classList.remove('landscape')
    }
  }

  scaleAndOrient()

  window.addEventListener('resize', () => {
    scaleAndOrient()
  })

  game.fx = fx
}

setTimeout(() => {
  game.end = end(game)

  const context = document.querySelector('canvas').getContext('2d')

  //game.end.show(context)
}, 0)

let skipToGame = false

if (!skipToGame) {
  ;(async () => {
    const api = await audio({}, () => {
      title()
    })

    document.addEventListener('visibilitychange', (event) => {
      if (document.visibilityState === 'visible') {
        api.fadeIn(api.mainGain)
      } else {
        api.fadeOut(api.mainGain)
      }
    })
  })()
}
