function quickSort(array) {
  if (array.length <= 1) {
    return array;
  }
  let pivotIndex = Math.floor(array.length / 2);
  let pivot = array.splice(pivotIndex, 1)[0];

  let left = [];
  let right = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] <= pivot) {
      // 小于基准值的放左边
      left.push(array[i]);
    } else {
      // 大于基准值的放右边
      right.push(array[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
}
let arr = [5, 3, 7, 4, 1, 9, 2, 6, 8];
console.log(quickSort(arr)); // 输出: [1, 2, 3, 4, 5, 6, 7, 8, 9]
//递归最大深度
// O(n logn)

// [1, 2, 3, 4, 5]

// 一个空的数组，另一个包含 [] [2, 3, 4, 5] 的数组。

// 一个空的数组，另一个包含 [] [3, 4, 5] 的数组。

// 空的子数组 n-1个元素的数组

// n 次分割操作才能完成整个数组的排序

// n-1、n-2、n-3...个元素。所以总的操作次数（即时间复杂度）就是 n + (n - 1) + (n - 2) + ... + 1

// 等差数列求和  (n^2 + n) / 2 -> O(n^2)

//空间复杂度

// O(log n) - O(n)
