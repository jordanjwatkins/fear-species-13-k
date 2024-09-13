export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

export function shuffle(arr) {
  arr.sort(() => (Math.random() > 0.5 ? -1 : 1))

  return arr
}

export function getRandomSubset(arr, size) {
  let copy = [...arr]

  const slice = shuffle(copy).slice(0, size)

  return slice
}
