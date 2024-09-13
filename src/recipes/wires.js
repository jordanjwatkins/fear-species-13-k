import { getRandomSubset } from '../utils'

export default {
  key: 'wires-c',
  displayName: 'Wires I',
  items: {
    K: [{ name: 'red' }, { name: 'green' }, { name: 'blue' }],
  },
  picked: [],
  onStart(game) {
    this.colorSubset = []
    this.picked = []
    this.colorSubset = getRandomSubset(
      [...this.items.K.map((item) => item.name)],
      3
    )

    console.log('colrs', this.colorSubset)

    game.workspace.elRecipeProgressInstructions.innerHTML +=
      '<div>Wiring Instructions: <br />(in order) <br />' +
      this.colorSubset.join(' (K), ') +
      ' (K)'
    ;('</div>')

    game.workspace.elProject.innerHTML += `
      <div class="wiring wires-c">
        <div class="housing">
          ${this.colorSubset
            .map((color) => {
              return `<div class="wire-wrap ${color}">
              <div class="left ${color}"></div>
              <div class="middle ${color}"></div>
              <div class="right ${color}"></div>
            </div>`
            })
            .join('')}
        </div>
      </div>`
  },
  onPick(col, index, parts, game) {
    const partName = parts[index].querySelector('.part').innerHTML

    //game.workspace.elRecipeProgressItems.innerHTML += `<div>${partName}</div>`

    this.picked.push(partName)

    document
      .querySelector(`.wiring .wire-wrap.${partName}`)
      .classList.add('repaired')

    parts[index].classList.add('step-disabled')

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

      return 1
    } else {
      game.roundRecord.bad += 1

      return -1
    }
  },
}
