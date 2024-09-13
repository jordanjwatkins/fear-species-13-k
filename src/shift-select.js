// Posting / Duty

import keys from './input'
import recipes from './recipes'
import { randomItem } from './utils'

const postings = {
  'Backwater Station': {
    duties: {
      'Manual Reset All The Things': {
        recipes: ['coveredReset'],
      },
      'Resets And Panel Repair': {
        recipes: ['coveredReset', 'loosePanel'],
      },
    },
  },

  'Supply Line Transport': {
    duties: {
      'Basic Repairs': {
        recipes: ['coveredReset', 'loosePanel', 'wiresC'],
      },
      'Emergency Repairs': {
        recipes: ['coveredReset', 'loosePanel', 'wiresC' /*, 'wiresB'*/],
      },
    },
  },

  'Front Line Transport': {
    duties: {
      'Active Battle Repairs': {
        recipes: ['coveredReset', 'loosePanel', 'wiresC', 'wiresB'],
        // faster paced
      },
      'Intensive After-Battle Repairs': {
        recipes: ['coveredReset', 'loosePanel', 'wiresC', 'wiresB'],
      },
    },
  },

  'Command Ship': {
    duties: {
      'Advanced Systems Repair': {
        recipes: ['coveredReset', 'loosePanel', 'wiresC', 'wiresB', 'wiresA'],
      },
      'Core Systems Repair': {
        recipes: ['coveredReset', 'loosePanel', 'wiresC', 'wiresB', 'wiresA'],
        // faster paced, eventually arrive at task to optionally win game (with "wrong" wires)
      },
    },
  },
}

const allDuties = Object.values(postings).reduce((prevValue, currentValue) => {
  return { ...prevValue, ...currentValue.duties }
}, {})

console.log('all duties', allDuties)

export default (game) => {
  const el = document.createElement('div')

  el.classList.add('shift-select', 'show')

  game.workspace.el.appendChild(el)

  let elShiftHeader
  {
    elShiftHeader = document.createElement('div')

    elShiftHeader.classList.add('shift-header')

    game.workspace.el.appendChild(elShiftHeader)
  }

  const shiftSelect = {
    el,
    elShiftHeader,
    shiftOrdersCompleted: 0,
    maxShiftOrders: 2,
    dutyKeys: ['Q', 'W', 'E', 'R', '1', '2', '3', '4'],
    allDuties,

    init() {
      let dutyIndex = 0

      this.elDuties = []

      for (const [postingName, postingDetails] of Object.entries(postings)) {
        console.log('posting', postingName, postingDetails)

        const elPosting = document.createElement('div')

        elPosting.classList.add('posting')

        elPosting.innerHTML = `<h1>${postingName}</h1>`

        for (const [dutyName, dutyDetails] of Object.entries(
          postingDetails.duties
        )) {
          const elDuty = document.createElement('div')

          elDuty.innerHTML += `<div>${this.dutyKeys[dutyIndex]}) ${dutyName}</div><div class="rank"></div>`

          elPosting.appendChild(elDuty)

          this.elDuties.push(elDuty)

          const levelRanks = game.storage.state.levelRanks

          //if (Object.values(levelRanks).length > 0) {

          if (levelRanks[dutyName]) {
            this.setRank(dutyIndex, levelRanks[dutyName])
          } else if (dutyIndex > 0) {
            const prevDutyName = Object.keys(this.allDuties)[dutyIndex - 1]
            const prevDutyRank = levelRanks[prevDutyName]

            console.log('prev duty', prevDutyName, prevDutyRank)

            if (prevDutyRank !== 'A' && prevDutyRank !== 'B')
              elDuty.classList.add('disabled')
          }

          /*elDuty.addEventListener('pointerup', () => {
            this.selectShift(dutyName, dutyDetails)
          })*/

          elDuty.selectShift = () => this.selectShift(dutyName, dutyDetails)

          dutyIndex++
        }

        el.appendChild(elPosting)
      }
    },

    selectShift(name, details) {
      if (this.shiftName) return

      const duty = this.allDuties[name]
      const dutyIndex = Object.values(allDuties).indexOf(duty)

      this.maxShiftOrders = 5 + dutyIndex * 2

      if (dutyIndex !== 0 && dutyIndex % 2 !== 0) {
        this.maxShiftOrders * 2
      }

      //this.maxShiftOrders = 1

      console.log('max shift order', this.maxShiftOrders)

      if (this.elDuties[dutyIndex].classList.contains('disabled')) return

      this.shiftName = name

      // hide shift select
      el.classList.remove('show')

      // start level
      console.log('start shift', name, details)

      elShiftHeader.innerHTML = `<h2>${name}</h2>`

      elShiftHeader.innerHTML += `<div class="duty-select-prompt show">&larr; [ TASK ]</div>`

      game.orderList.el.classList.add('show')

      const shiftRecipes = {}

      for (const [key, recipe] of Object.entries(recipes)) {
        console.log('recipe', key, recipe, details.recipes)

        if (details.recipes.indexOf(key) > -1) {
          shiftRecipes[key] = recipe
        }
      }

      console.log('shift recipes', shiftRecipes)

      let ordersAdded = 0

      for (let i = 0; i < 3; i++) {
        console.log(
          'try add',
          ordersAdded < this.maxShiftOrders,
          ordersAdded,
          this.maxShiftOrders
        )
        if (ordersAdded < this.maxShiftOrders) {
          console.log('add recipe!')

          ordersAdded += 1

          setTimeout(() => {
            game.orderList.addOrder(randomItem(Object.values(shiftRecipes)))
          }, 400 * i)
        }
      }

      const intervalHandle = setInterval(
        () => {
          if (ordersAdded >= this.maxShiftOrders) {
            clearInterval(intervalHandle)

            console.log('last order added')
          } else {
            for (let i = 0; i < 2; i++) {
              setTimeout(() => {
                console.log(
                  'lengths',
                  game.orderList.orders.filter((order) => order).length,
                  game.orderList.orders.length
                )

                if (
                  game.orderList.orders.filter((order) => order).length <
                    game.orderList.orders.length &&
                  ordersAdded < this.maxShiftOrders
                ) {
                  game.orderList.addOrder(
                    randomItem(Object.values(shiftRecipes))
                  )

                  ordersAdded += 1
                }
              }, 400 * i)
            }
          }
        },
        dutyIndex > 3 ? 17000 : 10000
      )
    },

    shiftComplete() {
      this.shiftOrdersCompleted = 0

      game.orderList.el.classList.remove('show')

      game.shiftSelect.elShiftHeader
        .querySelector('.duty-select-prompt')
        .classList.remove('show')

      const { good, bad } = game.roundRecord

      this.elShiftHeader.classList.add('results')
      this.elShiftHeader.innerHTML += `<div>Succeeded: ${good}</div>`
      this.elShiftHeader.innerHTML += `<div>Failed: ${bad}</div>`

      const ranks = ['A', 'B', 'C', 'D']

      let rank = 'A'

      if (bad > 8) {
        rank = 'D'
      } else if (bad > 3) {
        rank = 'C'
      } else if (bad > 0) {
        rank = 'B'
      }

      this.elShiftHeader.innerHTML += `<div class="rank">Rank: ${rank}</div>`

      this.elShiftHeader.innerHTML += `<div class="next-round">A</div>`

      //game.storage.state.levelRanks[this.shiftName] = rank

      //console.log('saved ranks', game.storage.state.levelRanks)

      const duty = this.allDuties[this.shiftName]

      const dutyIndex = Object.values(allDuties).indexOf(duty)

      console.log('duty index', dutyIndex)

      const currentRank =
        this.elDuties[dutyIndex].querySelector('.rank').innerHTML

      if (!currentRank || ranks.indexOf(rank) < ranks.indexOf(currentRank)) {
        this.setRank(dutyIndex, rank)
      }

      if (rank === 'B' || rank === 'A') {
        console.log('ranked top!', this.allDuties, this.shiftName)

        this.elDuties[dutyIndex + 1]?.classList.remove('disabled')

        if (dutyIndex === 7) {
          game.end.show()
        }
      }

      this.shiftName = ''
    },

    setRank(dutyIndex, rank) {
      console.log('set rank')
      this.elDuties[dutyIndex].querySelector('.rank').innerHTML = rank
      this.elDuties[dutyIndex].querySelector('.rank').className = 'rank'
      this.elDuties[dutyIndex].querySelector('.rank').classList.add(rank)

      game.storage.state.levelRanks[this.shiftName] = rank
      game.storage.save()
    },

    update() {
      if (this.el.classList.contains('show')) {
        for (const [index, dutyKey] of this.dutyKeys.entries()) {
          //console.log('duty', index, dutyKey)
          if (keys[dutyKey.toLowerCase()]?.justDown) {
            console.log(
              'duty key down',
              dutyKey.toLowerCase(),
              this.el.querySelectorAll('.posting > div > div')
            )

            this.el.querySelectorAll('.posting > div')[index].selectShift()
          }
        }
      }

      // close results
      if (this.elShiftHeader.classList.contains('results')) {
        for (const key of Object.values(keys)) {
          if (key.justDown) {
            this.elShiftHeader.classList.remove('results')
            game.roundRecord.good = 0
            game.roundRecord.bad = 0
            this.elShiftHeader.innerHTML = ''
            this.el.classList.add('show')
          }
        }
      }
    },
  }

  shiftSelect.init()

  return shiftSelect
}
