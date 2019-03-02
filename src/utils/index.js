export function toggleStateKey(key) {
  return state => ({
    [key]: !state[key],
  })
}
