import { knote, NEAR_ZERO } from './libs/JamKnoteCure'

const api = {}

let audioStarted = false

export default (config, onInit) =>
  new Promise((resolve) => {
    const elAudioText = document.createElement('div')

    elAudioText.classList.add('audio-text')
    elAudioText.innerHTML = 'Interact to Play'

    document.body.appendChild(elAudioText)

    config.knote = knote

    function startAudio() {
      if (audioStarted) return
      if (document.body.classList.contains('audio-ready')) return
      if (!knote.initted) knote.init(new window.AudioContext())

      if (!knote.initted) return

      api.songGainNode = knote.audioContext.createGain()
      api.songGainNode.value = 0.5

      api.songGainNode.connect(knote.mainGain)
      api.mainGain = knote.mainGain

      api.mainGain.value = 1

      const playNote = (noteNameAndOctave, options) => {
        knote.playNote(knote.makeNote(noteNameAndOctave), {
          ...options,
          groupGainNode: api.songGainNode,
        })
      }

      api.fadeOut = (gainNode) => {
        gainNode.gain.setValueCurveAtTime(
          [1, 0.9, NEAR_ZERO],
          knote.audioContext.currentTime,
          1
        )
      }

      api.fadeIn = (gainNode) => {
        gainNode.gain.setValueCurveAtTime(
          [NEAR_ZERO, 1],
          knote.audioContext.currentTime,
          0.5
        )
      }

      const now = knote.audioContext.currentTime

      let delay = 1000

      const kickLoop = (startTime) => {
        kick()

        setTimeout(() => {
          kick(120)
        }, 120)

        setTimeout(() => {
          kickLoop(startTime + 0.5)
        }, delay)
      }

      kickLoop(now)

      const bassLoop = (startTime) => {
        const now = knote.audioContext.currentTime

        if (now > startTime - 2) {
          playNote('Fb1', {
            duration: 2,
            delay: startTime - now,
          })
          playNote('Fb1', {
            duration: 2,
            delay: startTime - now + 2,
          })
          playNote('Eb1', {
            duration: 2,
            delay: startTime - now + 4,
          })
          playNote('Db1', {
            duration: 2,
            delay: startTime - now + 6,
          })

          /* setTimeout(() => {
            bassLoop(startTime + 8)
          }, 1000)*/
          setTimeout(() => {
            bassLoop(startTime + 8)
          }, 1000)
        } else {
          setTimeout(() => {
            bassLoop(startTime)
          }, 1000)
        }

        return true
      }

      if (!config.bassLoop) config.bassLoop = bassLoop(now)

      let section = 0

      const midLoop = (startTime) => {
        const now = knote.audioContext.currentTime

        if (now > startTime - 2) {
          playNote('Ab3', {
            duration: 5,
            delay: startTime - now,
            gain: 0.1,
          })
          playNote('B3', {
            duration: 2,
            delay: startTime - now + 4,
            gain: 0.1,
          })

          playNote('Bb3', {
            duration: 2,
            delay: startTime - now + 6,
            gain: 0.1,
          })
          setTimeout(() => {
            midLoop(startTime + 8)
          }, 1000)
        } else {
          setTimeout(() => {
            midLoop(startTime)
          }, 1000)
        }

        return true
      }

      if (!config.midLoop) config.midLoop = midLoop(now + 8)

      const hiLoop = (startTime) => {
        const now = knote.audioContext.currentTime

        if (now > startTime - 0.5) {
          playNote('Ab6', {
            duration: 1.2,
            delay: startTime - now,
            gain: 0.05,
          })
          playNote('G6', {
            duration: 0.1,
            delay: startTime - now + 0.25,
            gain: 0.05,
          })

          setTimeout(() => {
            hiLoop(startTime + 2)
          }, 50)
        } else {
          setTimeout(() => {
            hiLoop(startTime)
          }, 250)
        }

        return true
      }

      if (!config.hiLoop) config.hiLoop = hiLoop(now)

      resolve(api)

      audioStarted = true

      onInit()

      setTimeout(() => {
        document.body.classList.add('audio-ready')
        document.querySelector('.audio-text').classList.add('hide')
      }, 300)
    }

    document.body.addEventListener('click', startAudio)
    document.body.addEventListener('pointerup', startAudio)
    document.body.addEventListener('keyup', startAudio)
  })

/*document.body.addEventListener('click', () => {
  kick()
})*/

function kick(tone = 190) {
  const audioContext = knote.audioContext

  const kickOscillator = audioContext.createOscillator()

  const currentTime = audioContext.currentTime

  // Frequency in Hz. This corresponds to a C note.
  kickOscillator.frequency.setValueAtTime(tone, currentTime)
  kickOscillator.frequency.exponentialRampToValueAtTime(
    0.001,
    currentTime + 0.5
  )

  const kickGain = audioContext.createGain()

  kickGain.gain.setValueAtTime(7, currentTime)
  kickGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5)

  kickOscillator.connect(kickGain)
  //kickGain.connect(primaryGainControl)
  kickGain.connect(knote.mainGain)

  kickOscillator.start()
  // This will stop the oscillator after half a second.
  kickOscillator.stop(currentTime + 0.5)
}
