class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  swap(i, j) {
    // 交换数组中的两个元素
    // this.heap[i] = this.heap[j];
    // const [a,b]=[1,2]
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  heapifyUp(index) {
    // 从当前节点向上堆化
    const parentIndex = this.getParentIndex(index);
    if (parentIndex >= 0 && this.heap[index] < this.heap[parentIndex]) {
      // 如果当前节点小于父节点，则交换它们，并继续向上堆化
      this.swap(index, parentIndex);
      this.heapifyUp(parentIndex);
    }
  }

  heapifyDown(index) {
    // 从当前节点向下堆化
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let smallestIndex = index;

    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex] < this.heap[smallestIndex]
    ) {
      // 如果左子节点小于当前节点，则更新最小值的索引为左子节点的索引
      smallestIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex] < this.heap[smallestIndex]
    ) {
      // 如果右子节点小于当前节点（及可能更新后的最小值），则更新最小值的索引为右子节点的索引
      smallestIndex = rightChildIndex;
    }

    if (smallestIndex !== index) {
      // 如果最小值的索引不是当前节点的索引，则交换它们，并继续向下堆化
      this.swap(index, smallestIndex);
      this.heapifyDown(smallestIndex);
    }
  }

  insert(value) {
    // 插入元素到堆中
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin() {
    // 提取堆顶的最小值
    if (this.heap.length === 0) {
      return null;
    }

    const minValue = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);

    return minValue;
  }
}
