export default {
  key: 'loose-panel',
  displayName: 'Loose Panel',
  items: {
    K: [{ name: 'Position' }],
    L: [
      { name: 'Screw 1', disabled: true },
      { name: 'Screw 2', disabled: true },
      { name: 'Screw 3', disabled: true },
      { name: 'Screw 4', disabled: true },
    ],
  },
  screws: 0,
  onStart(game) {
    game.workspace.elRecipeProgressInstructions.innerHTML +=
      '<div>Steps:<br />- Position (K)<br />- Screw x 4 (L)</div>'

    game.workspace.elProject.innerHTML += `
      <div class="loose-panel">
        <div class="housing">
          <div class="panel">
            <div class="hole hole-1"></div>
            <div class="hole hole-2"></div>
            <div class="hole hole-3"></div>
            <div class="hole hole-4"></div>
          </div>
        </div>
      </div>`
  },
  onPick(col, index, parts, game) {
    if (
      col === 0 &&
      index === 0 &&
      !parts[0].classList.contains('step-disabled')
    ) {
      document.querySelector('.loose-panel').classList.add('step-1')
      parts[0].classList.add('step-disabled')

      for (let i = 4; i < 8; i++) {
        parts[i].classList.remove('step-disabled')
      }
    }

    if (col === 1 && !parts[index].classList.contains('step-disabled')) {
      parts[index].classList.add('step-disabled')

      this.screws += 1

      document
        .querySelector(`.loose-panel .hole-${index - 3}`)
        .classList.add('filled')
    }

    if (this.screws === 4) {
      game.workspace.elSubmit.classList.remove('disabled')
    }
  },
  onSubmit(game) {
    game.roundRecord.good += 1

    return 1
  },
}
