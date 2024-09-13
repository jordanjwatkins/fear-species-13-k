window.AudioContext = window.AudioContext || window.webkitAudioContext

let audioContext = false

// Using 0 for values can break in some cases (ex. gain.exponentialRampToValue)
export const NEAR_ZERO = 0.001

if (window.AudioContext) {
  audioContext = new window.AudioContext()
}

// Quote keys so they're safe from prop mangling
/* eslint-disable quote-props */
const semitoneMap = {
  'C': 3,
  'D': 5,
  'E': 7,
  'F': 8,
  'G': 10,
  'A': 12,
  'B': 14,
}
/* eslint-enable quote-props */

function isAudioApiSupported() {
  return !!audioContext
}

function toInt(value) {
  return parseInt(value, 10)
}

function makeBrownNoiseNode(audioContext) {
  const bufferSize = 4096

  let lastOut = 0.0
  const node = audioContext.createScriptProcessor(bufferSize, 1, 1)

  node.onaudioprocess = (e) => {
    const output = e.outputBuffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1

      output[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = output[i]
      output[i] *= 3.5 // (roughly) compensate for gain
    }
  }

  return node
}

export default class JamKnote {
  constructor(audioContextIn) {
    if (isAudioApiSupported()) this.init(audioContextIn)
  }

  init(audioContextIn) {
    if (!isAudioApiSupported()) return

    this.initted = true

    this.audioContext = audioContextIn || audioContext

    audioContext = this.audioContext

    this.mainGain = audioContext.createGain()
    this.mainCompressor = audioContext.createDynamicsCompressor()

    this.mainGain.connect(this.mainCompressor)
    this.mainCompressor.connect(audioContext.destination)

    //this.mainGain.connect(this.audioContext.destination)

    this.mainGain.gain.value = 1

    this.brownNoiseNode = makeBrownNoiseNode(this.audioContext)
    this.noiseGain = audioContext.createGain(this.mainGain)

    this.noiseGain.gain.value = NEAR_ZERO

    this.brownNoiseNode.connect(this.noiseGain)
    this.noiseGain.connect(this.mainGain)
  }

  fireNoise() {
    this.noiseGain.gain.exponentialRampToValueAtTime(1, audioContext.currentTime + 0.1)
    this.noiseGain.gain.exponentialRampToValueAtTime(NEAR_ZERO, audioContext.currentTime + 1.2)
  }

  cardNoise() {
    this.noiseGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1)
    this.noiseGain.gain.exponentialRampToValueAtTime(NEAR_ZERO, audioContext.currentTime + 0.5)
  }

  makeOscillators(instrument = 'default', groupGainNode) {
    if (instrument === 'ocarina') {
      return [
        this.makeOscillator({ waveType: 'sine', detune1: 4, gain: 0.25 / 4, attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.2 }, groupGainNode),
        this.makeOscillator({ waveType: 'triangle', detune1: 4.001, gain: 0.1 / 4, attack: 0.1, decay: 0.2, sustain: 0.3, release: 0.2 }, groupGainNode),
      ]
    }

    return [
      this.makeOscillator({ waveType: 'triangle', detune1: 1, gain: 0.21, attack: 0.05, decay: 0.6, hold: 0.3, sustain: 0.6, release: 0.2 }, groupGainNode),
      this.makeOscillator({ waveType: 'triangle', detune1: 0.5, gain: 0.11, attack: 0.01, decay: 0.4, hold: 0.3, sustain: 0.5, release: 0.2 }, groupGainNode),
      this.makeOscillator({ waveType: 'square', detune1: 2, gain: 0.01, attack: 0.01, decay: 0.4, hold: 0.3, sustain: 0.1, release: 0.2 }, groupGainNode),



      //this.makeOscillator({ waveType: 'triangle', detune1: 1.01, detune2: 1.0017 }),
    ]
  }

  makeOscillator(options = {}, groupGainNode) {
    const config = options || {}
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    const gain = options.gain ?? 0.2

    oscillator.type = config.waveType || 'sine'
    oscillator.detune1 = options.detune1 || 1
    oscillator.detune2 = options.detune2 || 1
    oscillator.baseGain = gain
    oscillator.attack = options.attack || 0.01
    oscillator.decay = options.decay || 0.01
    oscillator.sustain = options.sustain || 0.01
    oscillator.release = options.release || 0.01
    oscillator.hold = options.hold || 0.1

    oscillator.gainNode = gainNode

    gainNode.gain.value = NEAR_ZERO

    oscillator.connect(gainNode)

    if (groupGainNode) {
      gainNode.connect(groupGainNode)
    } else {
      gainNode.connect(this.mainGain)
    }

    return oscillator
  }

  startOscillators(startTime = 0, oscillators) {
    oscillators = oscillators || this.oscillators

    oscillators.forEach((osc) => {
     // const gain = osc.gainNode.gain.value

      setTimeout(() => {
        //osc.gainNode.gain.setValueAtTime(NEAR_ZERO, startTime)

        osc.start(startTime)

        // Try to zero out without pop
        osc.gainNode.gain.exponentialRampToValueAtTime(NEAR_ZERO, startTime)

        setTimeout(() => {
          osc.gainNode.gain.exponentialRampToValueAtTime(osc.baseGain, startTime + osc.attack)
          osc.gainNode.gain.exponentialRampToValueAtTime(osc.baseGain * osc.sustain || NEAR_ZERO, startTime + osc.attack + osc.hold + osc.decay)
        }, 0)
      }, 0)
    })
  }

  setOscillatorsFrequency(f, oscillators) {
    oscillators = oscillators || this.oscillators
    //oscillators.forEach(osc => console.log(f * osc.detune1 * osc.detune2))

    oscillators.forEach(osc => osc.frequency.value = f * osc.detune1 * osc.detune2)
  }

  setOscillatorsGain(g, oscillators) {
    oscillators = oscillators || this.oscillators
    oscillators.forEach(osc => osc.gainNode.gain.value = g)
  }

  stopOscillators(stopTime = 0, oscillators) {
    oscillators = oscillators || this.oscillators
    oscillators.forEach((osc) => {
      // osc.stop(stopTime)
      osc.gainNode.gain.exponentialRampToValueAtTime(NEAR_ZERO, stopTime + osc.release)

      setTimeout(() => {
        osc.stop(stopTime + osc.release)
      }, 0)
    })
  }

  makeNote(noteName) {
    if (!isAudioApiSupported()) return

    const note = {}
    const octaveIndex = (noteName.length === 3) ? 2 : 1

    note.letter = noteName[0]
    note.octave = toInt(noteName[octaveIndex])

    if (octaveIndex === 2) {
      note.accidental = noteName[1]
      note.accidentalOffset = (note.accidental === 'b') ? -1 : 1
    }

    note.frequency = this.calculateNoteFrequency(note)

    note.name = noteName

    return note
  }

  playNote(note, options, groupGainNode) {
    if (!isAudioApiSupported()) return

    if (this.oscillators && this.oscillators.length) this.stopOscillators()

    const oscillators = this.makeOscillators(options.instrument, groupGainNode)

    this.setOscillatorsFrequency(note.frequency, oscillators)

    const gain = options.gain || 0.2

    this.setOscillatorsGain(gain, oscillators)

    const delay = options.delay || 0

    this.startOscillators(audioContext.currentTime + delay, oscillators)

    const duration = options.duration || 0.25

    this.stopOscillators(audioContext.currentTime + delay + duration, oscillators)
  }

  calculateNoteFrequency(note) {
    const defaultOctaveSemitones = 5 * 12

    let semitoneOffset = semitoneMap[note.letter]

    semitoneOffset += (note.accidentalOffset) ? note.accidentalOffset : 0

    semitoneOffset += (note.octave * 12) - defaultOctaveSemitones

    const frequency = this.frequencyByOffset(440, semitoneOffset)

    return (Number.isNaN(frequency)) ? 0 : frequency
  }

  frequencyByOffset(baseFrequency, semitoneOffset) {
    return baseFrequency * (2 ** (semitoneOffset / 12))
  }
}

export const knote = new JamKnote()
