function selectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    let temp = array[i];
    array[i] = array[minIndex];
    array[minIndex] = temp;
  }
  return array;
}
let array = [64, 25, 12, 22, 11];
console.log('Sorted array is:', selectionSort(array));


function selectionSort(array) {
  // 输入验证
  if (!Array.isArray(array) || array.length <= 1) {
    return array;
  }
  
  // 创建副本，避免修改原数组
  const sortedArray = [...array];
  const length = sortedArray.length;
  
  for (let i = 0; i < length - 1; i++) { // 优化：只需要 length-1 次循环
    let minIndex = i;
    
    // 寻找最小值的索引
    for (let j = i + 1; j < length; j++) {
      if (sortedArray[j] < sortedArray[minIndex]) {
        minIndex = j;
      }
    }
    
    // 优化：只有当最小值不在当前位置时才交换
    if (minIndex !== i) {
      // 使用解构赋值进行交换，更简洁
      [sortedArray[i], sortedArray[minIndex]] = [sortedArray[minIndex], sortedArray[i]];
    }
  }
  
  return sortedArray;
}