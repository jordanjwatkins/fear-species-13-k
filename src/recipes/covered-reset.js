export default {
  key: 'covered-button',
  displayName: 'Hard Reset',
  items: {
    K: [{ name: 'press', disabled: true }, { name: 'open' }],
  },
  onStart(game) {
    game.workspace.elProject.innerHTML += `
      <div class="covered-reset">
        <div class="light"></div>
        <div class="cover"><div class="button"></div></div>
      </div>`

    game.workspace.elRecipeProgressInstructions.innerHTML +=
      '<div>Instructions:<br/>- Open (K)<br/>- Press (K)</div>'
  },
  onPick(col, index, parts, game) {
    if (col === 0 && index === 1) {
      if (!parts[1].classList.contains('step-disabled')) {
        parts[0].classList.remove('step-disabled')
        parts[1].classList.add('step-disabled')

        //game.workspace.elRecipeProgressItems.innerHTML += '<div>Open</div>'
        game.workspace.elProject.classList.add('step-1')
      }
    }

    if (col === 0 && index === 0) {
      if (
        parts[1].classList.contains('step-disabled') &&
        !parts[0].classList.contains('step-disabled')
      ) {
        parts[0].classList.add('step-disabled')

        //game.workspace.elRecipeProgressItems.innerHTML += '<div>Press</div>'

        game.workspace.elProject.classList.add('step-2')

        setTimeout(() => {
          game.workspace.elProject.classList.add('step-3')

          setTimeout(() => {
            game.workspace.elSubmit.classList.remove('disabled')
          }, 300)
        }, 1300)

        // recipe done
      }
    }
  },
  onSubmit(game) {
    game.roundRecord.good += 1

    return 1
  },
}
