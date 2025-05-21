var a = 1;
var i = 0;
var arr = [11, 22, 3, 33, 444, 555];
while (i <= arr.length) {
  i++;
  console.log(i);
}

var a = 1;
var i = 1;
var arr = [11, 22, 3, 33, 444, 555];
while (i <= arr.length) {
  console.log(i);
  i *= 2;
}

function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

var arr = [11, 22, 33, 44, 55, 66];
var target = 33;
var index = binarySearch(arr, target);
console.log('Element found at index:', index);
