import keys from './input'

export default (game) => {
  const el = document.createElement('div')

  el.classList.add('workspace', 'honeycomb')

  game.el.appendChild(el)

  const elProject = document.createElement('div')

  elProject.classList.add('project')

  const elRecipeProgress = document.createElement('div')

  elRecipeProgress.classList.add('recipe-progress')

  const elRecipeProgressInstructions = document.createElement('div')

  elRecipeProgressInstructions.classList.add('recipe-progress-instructions')

  elRecipeProgress.appendChild(elRecipeProgressInstructions)

  const elRecipeProgressItems = document.createElement('div')

  elRecipeProgressItems.classList.add('recipe-progress-items')

  elRecipeProgress.appendChild(elRecipeProgressItems)

  const elSubmit = document.createElement('div')

  elSubmit.classList.add('order-submit', 'disabled')
  elSubmit.innerHTML = 'A'

  el.appendChild(elProject)
  el.appendChild(elRecipeProgress)
  el.appendChild(elSubmit)

  return {
    el,
    elRecipeProgress,
    elRecipeProgressInstructions,
    elRecipeProgressItems,
    elProject,
    elSubmit,

    orderUp() {
      // clear recipe progress
      el.classList.remove('active-order')
      elRecipeProgressInstructions.innerHTML = ''
      elRecipeProgressItems.innerHTML = ''
      elSubmit.classList.add('disabled')
      elProject.innerHTML = ''
      elProject.className = 'project'

      // update score
      //game.roundRecord.good += 1
      if (game.currentRecipe.onSubmit(game) === -1) {
        el.classList.add('fail')
      } else {
        el.classList.add('success')
      }

      setTimeout(() => {
        el.classList.remove('fail', 'success')
      }, 500)

      // clear order list item
      game.orderList.removeOrder(game.currentOrderIndex)
      game.currentOrderIndex = null
      game.currentRecipe = null

      // clear parts list
      game.orderParts.populateIngredients()
      game.orderParts.disableAll()

      game.shiftSelect.shiftOrdersCompleted += 1

      game.shiftSelect.elShiftHeader
        .querySelector('.duty-select-prompt')
        .classList.add('show')

      if (
        game.shiftSelect.shiftOrdersCompleted >= game.shiftSelect.maxShiftOrders
      ) {
        console.log('shift complete')
        game.shiftSelect.shiftComplete()
      }
    },

    update() {
      if (keys['a']?.justUp) {
        console.log('a press up')

        if (!elSubmit.classList.contains('disabled')) {
          console.log('Order Up!')

          this.elRecipeProgress.classList.remove('complete')

          this.orderUp()
        }
      }

      if (
        this.el.classList.contains('active-order') &&
        !this.elSubmit.classList.contains('disabled') &&
        game.orderParts.elPartsEnablers.classList.contains('show')
      ) {
        console.log('hide flash')

        game.orderParts.hideWorkFlash()
        this.elRecipeProgress.classList.add('complete')
      }
    },
  }
}
