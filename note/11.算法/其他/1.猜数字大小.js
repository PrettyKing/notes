var guessNumber = function (n) {
  var low = 1
  var high = n
  while (low <= high) {
    var mid = Math.floor((low + high) / 2)
    var res = guess(mid)
    if (res === 0) {
      return mid
    } else if (res === 1) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return -1
}