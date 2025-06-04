// 数组中第K个最大元素
// TopK
// 使用堆排序来解决这个问题——建立一个大顶堆，做k−1 次删除操作后,堆顶元素就是我们要找的答案（堆排序过程中，不全部下沉，下沉nums.length-k+1,然后堆顶可以拿到我们top k答案了）
var findKthLargest = function (nums, k) {
    // 构建大顶堆
    const heapify = (arr, n, i) => {
        let largest = i; // 初始化最大值为根节点
        const left = 2 * i + 1; // 左子节点
        const right = 2 * i + 2; // 右子节点

        // 如果左子节点比根节点大
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // 如果右子节点比当前最大值大
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // 如果最大值不是根节点，交换并继续堆化
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest);
        }
    };

    const n = nums.length;

    // 构建大顶堆
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(nums, n, i);
    }

    // 删除k-1次堆顶元素
    for (let i = n - 1; i > n - k; i--) {
        [nums[0], nums[i]] = [nums[i], nums[0]]; // 将堆顶元素与最后一个元素交换
        heapify(nums, i, 0); // 堆化剩余的元素
    }

    return nums[0]; // 返回堆顶元素，即第K个最大元素
};
