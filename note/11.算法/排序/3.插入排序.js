function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    //array[j] 前一个 key当前的
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j = j - 1;
    }

    array[j + 1] = key;
  }
  return array;
}

let array = [12, 11, 13, 5, 6];
insertionSort(array);
console.log('Sorted array is:', array);
