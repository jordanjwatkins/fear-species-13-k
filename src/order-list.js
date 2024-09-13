import keys from './input'

export default (game) => {
  const elOrderList = document.createElement('div')

  elOrderList.classList.add('order-list', 'honeycomb')

  let activeIndex = 0
  let activeItem
  const maxOrders = 8

  for (let i = 0; i < maxOrders; i++) {
    const elOrderItem = document.createElement('div')

    elOrderItem.classList.add('order-item')

    elOrderList.appendChild(elOrderItem)
  }

  game.el.appendChild(elOrderList)

  return {
    el: elOrderList,
    orders: new Array(maxOrders).fill(null),

    addOrder(recipe) {
      const openIndex = this.orders.indexOf(null)

      //console.log('open index', openIndex)

      if (openIndex > -1) {
        const elOrderItem = elOrderList.children[openIndex]

        elOrderItem.innerHTML = recipe.displayName

        this.orders[openIndex] = { ...recipe, patience: 200 }
      }
    },

    removeOrder(index) {
      this.orders[index] = null

      const elOrderItem = elOrderList.children[index]

      elOrderItem.innerHTML = ''

      elOrderItem.style.transform = `translate3d(0, 0, 0)`

      console.log(
        'score - ',
        'good ',
        game.roundRecord.good,
        ', ok ',
        game.roundRecord.ok,
        ', bad ',
        game.roundRecord.bad
      )
    },

    outOfPatience(index) {
      game.roundRecord.bad += 1
      game.shiftSelect.shiftOrdersCompleted += 1

      this.el.classList.add('timeout')

      setTimeout(() => {
        this.el.classList.remove('timeout')
      }, 1000)

      // clear order list item
      this.removeOrder(index)

      if (
        game.shiftSelect.shiftOrdersCompleted >= game.shiftSelect.maxShiftOrders
      ) {
        console.log('shift complete')

        game.shiftSelect.shiftComplete()
      }
    },

    update() {
      if (keys['ArrowUp']?.justDown && activeIndex) {
        for (const item of elOrderList.children) {
          item.classList.remove('active')
        }

        activeIndex -= 1
      }

      if (
        keys['ArrowDown']?.justDown &&
        activeIndex < elOrderList.children.length - 1
      ) {
        for (const item of elOrderList.children) {
          item.classList.remove('active')
        }

        activeIndex += 1
      }

      if (keys['x']?.justDown) {
        console.log('select order', game.currentOrderIndex)

        if (game.currentOrderIndex !== null) return
        console.log('select order 2')

        for (const [key, item] of Object.entries(elOrderList.children)) {
          if (item.classList.contains('active')) {
            if (!this.orders[key]) return
            //console.log('fizzbuzz')
            console.log('selected', this.orders[key])

            item.style.transform = 'translateY(0%)'

            game.selectOrder(this.orders[key], key)
          }
        }
      }

      elOrderList.children[activeIndex].classList.add('active')

      for (const [index, order] of Object.entries(this.orders)) {
        if (order === null) continue

        if (index !== game.currentOrderIndex) {
          order.patience -= 0.1

          if (order.patience < 100) {
            elOrderList.children[index].style.transform = `translate3d(-${
              100 - order.patience
            }%, 0, 0)`

            if (order.patience < 0) {
              // bad score and clear order
              this.outOfPatience(index)
            }
          }
        }
      }
    },
  }
}
