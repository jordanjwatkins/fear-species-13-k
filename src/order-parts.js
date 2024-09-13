import keys from './input'

export default (game) => {
  const elOrderParts = document.createElement('div')

  elOrderParts.classList.add('order-parts')

  const elOrderPartsList = document.createElement('div')

  elOrderPartsList.classList.add('order-parts-items')

  const assignedKeys = ['1', '2', '3', '4', 'q', 'w', 'e', 'r']

  // Parts grid
  //WOMBAT: drop to only 1-4 or only letters
  function populateIngredients() {
    elOrderPartsList.innerHTML = ''

    for (let i = 0; i < 8; i++) {
      const elOrderItem = document.createElement('div')

      elOrderItem.classList.add('order-part', 'col-disabled')

      if (game.currentRecipe) {
        const recipe = game.currentRecipe

        if (i < 4 && (recipe.items.K[i]?.disabled || !recipe.items.K[i]))
          elOrderItem.classList.add('step-disabled')

        if (
          i >= 4 &&
          (!recipe.items.L ||
            recipe.items.L[i - 4]?.disabled ||
            !recipe.items.L[i - 4])
        )
          elOrderItem.classList.add('step-disabled')

        if (
          (i < 4 && recipe.items.K[i]) ||
          (i > 3 && recipe.items.L && recipe.items.L[i - 4])
        )
          elOrderItem.innerHTML = `<div class="key">${assignedKeys[i]}</div>`

        if (i < 4 && recipe.items.K[i]) {
          elOrderItem.innerHTML += `<div class="part">${
            recipe.items.K[i]?.name || ''
          }</div>`
        } else if (recipe.items.L) {
          elOrderItem.innerHTML += `<div class="part">${
            recipe.items.L[i - 4]?.name || ''
          }</div>`
        }
      }

      elOrderPartsList.appendChild(elOrderItem)
    }
  }

  populateIngredients()

  // Parts enablers
  let elPartsEnablers
  {
    elPartsEnablers = document.createElement('div')

    elPartsEnablers.classList.add('parts-enablers')

    /*for (let i = 0; i < 2; i++) {
      const elPartsEnabler = document.createElement('div')

      if (i === 0) elPartsEnabler.innerHTML = 'K'
      if (i === 1) elPartsEnabler.innerHTML = 'L'

      elPartsEnablers.appendChild(elPartsEnabler)
    }*/

    elPartsEnablers.innerHTML = `&darr; WORK &darr;`

    elOrderParts.appendChild(elPartsEnablers)
  }

  elOrderParts.appendChild(elOrderPartsList)

  game.el.appendChild(elOrderParts)

  // Parts enablers
  let elPartsEnablers2
  {
    elPartsEnablers2 = document.createElement('div')

    elPartsEnablers2.classList.add('parts-enablers')

    /*for (let i = 0; i < 2; i++) {
      const elPartsEnabler = document.createElement('div')

      if (i === 0) elPartsEnabler.innerHTML = 'K'
      if (i === 1) elPartsEnabler.innerHTML = 'L'

      elPartsEnablers.appendChild(elPartsEnabler)
    }*/

    elPartsEnablers2.innerHTML = `&uarr; WORK &uarr;`

    elOrderParts.appendChild(elPartsEnablers2)
  }

  return {
    elOrderPartsList,
    elPartsEnablers,
    elPartsEnablers2,
    populateIngredients,

    disableAll() {
      for (const slot of elOrderPartsList.children) {
        slot.classList.add('step-disabled')
      }
    },

    showWorkFlash() {
      console.log('show work flash')
      ;[elPartsEnablers, elPartsEnablers2].forEach((elEnablers) =>
        elEnablers.classList.add('show')
      )
    },

    hideWorkFlash() {
      ;[elPartsEnablers, elPartsEnablers2].forEach((elEnablers) =>
        elEnablers.classList.remove('show')
      )
    },

    update() {
      for (const [index, assignedKey] of ['k', 'l'].entries()) {
        if (keys[assignedKey]?.justDown) {
          console.log('keys down', keys['k']?.down, keys['l']?.down)

          if (
            (assignedKey === 'k' && keys['l']?.down) ||
            (assignedKey === 'l' && keys['k']?.down)
          )
            continue

          console.log('one key down')

          //elPartsEnablers.children[index].classList.add('active')

          const startIndex = index ? 4 : 0

          console.log('start index', startIndex)

          for (let i = startIndex; i < startIndex + 4; i++) {
            console.log('child index enabled', i)

            elOrderPartsList.children[i].classList.remove('col-disabled')
          }
        } else if (keys[assignedKey]?.justUp) {
          //elPartsEnablers.children[index].classList.remove('active')

          const startIndex = index ? 4 : 0

          for (let i = startIndex; i < startIndex + 4; i++) {
            elOrderPartsList.children[i].classList.add('col-disabled')
          }
        }
      }

      for (const [index, assignedKey] of assignedKeys.entries()) {
        if (
          keys[assignedKey]?.justDown &&
          !elOrderPartsList.children[index].classList.contains(
            'col-disabled'
          ) &&
          !elOrderPartsList.children[index].classList.contains(
            'step-disabled'
          ) &&
          [1, 2, 3, 4, 'q', 'w', 'r', 't'].filter((value) => keys[value]?.down)
            .length < 2
        ) {
          elOrderPartsList.children[index].classList.add('active')
        } else if (
          keys[assignedKey]?.justUp &&
          !elOrderPartsList.children[index].classList.contains(
            'col-disabled'
          ) &&
          !elOrderPartsList.children[index].classList.contains(
            'step-disabled'
          ) &&
          elOrderPartsList.children[index].classList.contains('active')
        ) {
          elOrderPartsList.children[index].classList.remove('active')

          if (index < 4) {
            game.currentRecipe.onPick(0, index, elOrderPartsList.children, game)
          } else {
            game.currentRecipe.onPick(1, index, elOrderPartsList.children, game)
          }
        }
      }
    },
  }
}
