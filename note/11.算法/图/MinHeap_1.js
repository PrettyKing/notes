// 定义最小堆数据结构
class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  add(element) {
    this.heap.push(element);
    this.bubbleUp(this.heap.length - 1);
  }

  removeMin() {
    if (this.isEmpty()) {
      return null;
    }

    var minElement = this.heap[0];
    var lastElement = this.heap.pop();

    if (!this.isEmpty()) {
      this.heap[0] = lastElement;
      this.sinkDown(0);
    }

    return minElement;
  }

  bubbleUp(index) {
    var element = this.heap[index];
    while (index > 0) {
      var parentIndex = Math.floor((index - 1) / 2);
      var parent = this.heap[parentIndex];

      if (element.freq >= parent.freq) {
        break;
      }

      this.heap[index] = parent;
      index = parentIndex;
    }

    this.heap[index] = element;
  }

  sinkDown(index) {
    var element = this.heap[index];
    var leftChildIndex = 2 * index + 1;
    var rightChildIndex = 2 * index + 2;
    var smallestChildIndex = index;

    if (
      leftChildIndex < this.size() &&
      this.heap[leftChildIndex].freq < this.heap[smallestChildIndex].freq
    ) {
      smallestChildIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.size() &&
      this.heap[rightChildIndex].freq < this.heap[smallestChildIndex].freq
    ) {
      smallestChildIndex = rightChildIndex;
    }

    if (smallestChildIndex !== index) {
      this.heap[index] = this.heap[smallestChildIndex];
      this.heap[smallestChildIndex] = element;
      this.sinkDown(smallestChildIndex);
    }
  }
}

