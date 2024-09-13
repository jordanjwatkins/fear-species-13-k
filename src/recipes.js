import coveredReset from './recipes/covered-reset'
import loosePanel from './recipes/loose-panel'
import wiresC from './recipes/wires'
import wiresA from './recipes/wires-a'
import wiresB from './recipes/wires-b'
import { getRandomSubset } from './utils'

export default {
  coveredReset,
  wiresC,
  loosePanel,
  wiresB,
  wiresA,
  fizzbuzz: {
    key: 'fizzbuzz',
    displayName: 'FizzBuzz',
    // batter -> close
    // fizz then buzz
    // second step disabled - enabled after first step
    items: {
      K: [{ name: 'buzz', disabled: true }, { name: 'fizz' }],
    },
    onStart() {},
    onPick(col, index, parts, game) {
      //if (col === 0 && index === 1) this.items.K[0].disabled = false
      if (col === 0 && index === 1) {
        if (!parts[1].classList.contains('step-disabled')) {
          parts[0].classList.remove('step-disabled')
          parts[1].classList.add('step-disabled')

          game.workspace.elRecipeProgressItems.innerHTML += '<div>Fizz</div>'
        }
      }

      if (col === 0 && index === 0) {
        if (
          parts[1].classList.contains('step-disabled') &&
          !parts[0].classList.contains('step-disabled')
        ) {
          parts[0].classList.add('step-disabled')

          game.workspace.elRecipeProgressItems.innerHTML += '<div>Buzz</div>'

          game.workspace.elSubmit.classList.remove('disabled')
          // recipe done
        }
      }
    },
    onSubmit(game) {
      game.roundRecord.good += 1
    },
  },

  buzzfizz: {
    key: 'buzzfizz',
    displayName: 'BuzzFizz',
    items: {
      K: [{ name: 'buzz' }, { name: 'fizz', disabled: true }],
    },
    onStart() {},
    onPick(col, index, parts, game) {
      //if (col === 0 && index === 1) this.items.K[0].disabled = false
      if (col === 0 && index === 1) {
        if (!parts[1].classList.contains('step-disabled')) {
          //parts[0].classList.remove('step-disabled')
          parts[1].classList.add('step-disabled')

          game.workspace.elRecipeProgressItems.innerHTML += '<div>Fizz</div>'

          game.workspace.elSubmit.classList.remove('disabled')
          // recipe done
        }
      }

      if (col === 0 && index === 0) {
        if (
          parts[1].classList.contains('step-disabled') &&
          !parts[0].classList.contains('step-disabled')
        ) {
          parts[0].classList.add('step-disabled')
          parts[1].classList.remove('step-disabled')

          game.workspace.elRecipeProgressItems.innerHTML += '<div>Buzz</div>'
        }
      }
    },
    onSubmit(game) {
      game.roundRecord.good += 1
    },
  },

  colors: {
    key: 'colors',
    displayName: 'Colors',
    items: {
      K: [
        { name: 'red' },
        { name: 'green' },
        { name: 'blue' },
        { name: 'yellow' },
      ],
      L: [
        { name: 'purple' },
        { name: 'orange' },
        { name: 'pink' },
        { name: 'brown' },
      ],
    },
    picked: [],
    onStart(game) {
      this.colorSubset = []
      this.picked = []
      this.colorSubset = getRandomSubset(
        [
          ...this.items.K.map((item) => item.name),
          ...this.items.L.map((item) => item.name),
        ],
        3
      )

      game.workspace.elRecipeProgressInstructions.innerHTML +=
        '<div>Ingredients: ' +
        this.colorSubset
          .map((color) => {
            if (this.items.K.map((item) => item.name).indexOf(color) > -1) {
              return `${color} (K)`
            } else {
              return `${color} (L)`
            }
          })
          .join(', ')

      for (const slot of game.orderParts.elOrderPartsList.children) {
        slot.classList.remove('step-disabled')
      }
    },
    onPick(col, index, parts, game) {
      console.log('on pick', col, index, parts)

      const partName = parts[index].querySelector('.part').innerHTML

      console.log('pick', partName)

      game.workspace.elRecipeProgressItems.innerHTML += `<div>${partName}</div>`

      this.picked.push(partName)

      if (this.picked.length === 3) {
        game.workspace.elSubmit.classList.remove('disabled')
      }
    },
    onSubmit(game) {
      let matchCount = 0

      this.colorSubset.forEach((currentColor, index) => {
        console.log(currentColor, this.picked[index])

        if (currentColor === this.picked[index]) {
          console.log('right ingredient')

          matchCount += 1
        }
      })

      if (matchCount === this.colorSubset.length) {
        console.log('itsa gooood!')

        game.roundRecord.good += 1
      } else {
        game.roundRecord.bad += 1
      }
    },
  },
}
