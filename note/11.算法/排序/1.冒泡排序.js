function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

// 测试数据
let arr = [5, 3, 8, 4, 6];
console.log(bubbleSort(arr)); // 输出：[3, 4, 5, 6, 8]


// 优化版本1：提前终止优化
function bubbleSortOptimized1(arr) {
    const len = arr.length;
    
    for (let i = 0; i < len - 1; i++) {
        let swapped = false; // 标记本轮是否发生交换
        
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // 使用解构赋值交换
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        // 如果本轮没有交换，说明数组已经有序
        if (!swapped) {
            break;
        }
    }
    
    return arr;
}

// 优化版本2：记录最后交换位置
function bubbleSortOptimized2(arr) {
    let len = arr.length;
    
    while (len > 1) {
        let lastSwapIndex = 0; // 记录最后一次交换的位置
        
        for (let j = 0; j < len - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                lastSwapIndex = j + 1; // 更新最后交换位置
            }
        }
        
        // 下次只需要检查到最后交换的位置
        len = lastSwapIndex;
    }
    
    return arr;
}

// 优化版本3：双向冒泡排序（鸡尾酒排序）
function cocktailSort(arr) {
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;
    
    while (swapped) {
        swapped = false;
        
        // 正向冒泡：将最大值移到右端
        for (let i = start; i < end; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }
        end--;
        
        if (!swapped) break;
        
        swapped = false;
        
        // 反向冒泡：将最小值移到左端
        for (let i = end; i > start; i--) {
            if (arr[i] < arr[i - 1]) {
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                swapped = true;
            }
        }
        start++;
    }
    
    return arr;
}

// 现代JavaScript写法：函数式风格（适合小数组）
const bubbleSortFunctional = (arr) => {
    const result = [...arr]; // 创建副本，避免修改原数组
    const len = result.length;
    
    for (let i = 0; i < len - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < len - 1 - i; j++) {
            if (result[j] > result[j + 1]) {
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }
    
    return result;
};
