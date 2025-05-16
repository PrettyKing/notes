function binarySearch(array, target) {
  // 定义搜索范围的左边界和右边界
  let low = 0;
  let high = array.length - 1;
  while (low <= high) {
    // 计算中间位置
    const mid = Math.floor((low + high) / 2);
    // 获取中间位置的值 与 目标值进行比较
    const midVal = array[mid];
    if (midVal === target) {
      return mid;
      // 如果中间位置的值小于目标值，则在右半部分继续搜索
    } else if (midVal < target) {
      low = mid + 1;
    } else {
      // 如果中间位置的值大于目标值，则在左半部分继续搜索
      high = mid - 1;
    }
  }
  return -1; // 没有找到
}
// 使用示例：
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 7;
console.log(binarySearch(array, target)); // 输出：6
