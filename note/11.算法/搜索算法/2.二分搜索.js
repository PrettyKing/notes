function binarySearch(array, target) {
  let low = 0;
  let high = array.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = array[mid];
    if (midVal === target) {
      return mid;
    } else if (midVal < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1; 
}
// 使用示例：
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 7;
console.log(binarySearch(array, target)); // 输出：6
