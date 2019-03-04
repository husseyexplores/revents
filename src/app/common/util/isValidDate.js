export default function isValidDate(d) {
  if (Object.prototype.toString.call(d) === '[object Date]') {
    // it is a date
    // d.valueOf() could also work
    if (isNaN(d.getTime())) {
      return false
    } else {
      return true
    }
  }

  return false
}
