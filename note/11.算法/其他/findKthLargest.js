function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function quickSelect(nums, k, start, end) {
  if (start >= end) {
    return;
  }
  let pivot = nums[start];
    let left = start + 1;
    let right = end;
    while (left <= right) {
        if(nums[left] > pivot) {
            left++;
            continue
        }
        if(nums[right] <= pivot) {
            right--;
            continue
        }
        swap(nums, left, right);
    }
    swap(nums, start, right);
    if (right - start+1 == k) {
        return;
    }
    if (right - start + 1 > k) {
        quickSelect(nums, k, start, right - 1);
    } else {
        quickSelect(nums, k - (right - start + 1), right + 1, end);
    }
}

var findKthLargest = function (nums, k) {
  quickSelect(nums, k, 0, nums.length - 1);
  return nums[k - 1];
};
