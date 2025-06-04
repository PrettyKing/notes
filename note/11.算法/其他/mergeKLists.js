var mergeKLists = function (lists) {
  var dummy = new ListNode(0);
  var current = dummy;
  // 使用优先队列（最小堆）来存储每个链表的头节点
  var pq = new minPriorityQueue((a, b) => a.val - b.val);
  // 将所有链表的头节点加入优先队列
  for (var i = 0; i < lists.length; i++) {
    if (lists[i]) {
      pq.enqueue(lists[i]);
    }
  }
  // 当优先队列不为空时，取出最小的节点
  while (!pq.isEmpty()) {
    var node = pq.dequeue();
    current.next = node; // 将当前节点连接到结果链表
    current = current.next; // 移动到当前节点
    // 如果当前节点有下一个节点，将其加入优先队列
    if (node.next) {
      pq.enqueue(node.next);
    }
  }
  return dummy.next; // 返回合并后的链表
};

// 实现 PriorityQueue
class minPriorityQueue {
    constructor(compareFn) {
        this.heap = [];
        // 默认为最小堆，传入比较函数可以自定义优先级
        this.compare = compareFn || ((a, b) => a - b);
    }

    // 获取父节点索引
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    // 获取左子节点索引
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    // 获取右子节点索引
    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    // 交换两个元素
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    // 向上调整堆（用于插入操作）
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) {
                break;
            }
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    // 向下调整堆（用于删除操作）
    heapifyDown(index) {
        while (this.getLeftChildIndex(index) < this.heap.length) {
            const leftChildIndex = this.getLeftChildIndex(index);
            const rightChildIndex = this.getRightChildIndex(index);
            
            let smallestIndex = index;
            
            if (this.compare(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = leftChildIndex;
            }
            
            if (rightChildIndex < this.heap.length && 
                this.compare(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = rightChildIndex;
            }
            
            if (smallestIndex === index) {
                break;
            }
            
            this.swap(index, smallestIndex);
            index = smallestIndex;
        }
    }

    // 入队（插入元素）
    enqueue(element) {
        this.heap.push(element);
        this.heapifyUp(this.heap.length - 1);
    }

    // 出队（移除并返回优先级最高的元素）
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }

        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return root;
    }

    // 查看队首元素（不移除）
    peek() {
        return this.isEmpty() ? null : this.heap[0];
    }

    // 检查队列是否为空
    isEmpty() {
        return this.heap.length === 0;
    }

    // 获取队列大小
    size() {
        return this.heap.length;
    }

    // 清空队列
    clear() {
        this.heap = [];
    }

    // 转换为数组（用于调试）
    toArray() {
        return [...this.heap];
    }
}


// **核心功能：**
// - `enqueue(element)` - 入队操作
// - `dequeue()` - 出队操作，返回优先级最高的元素
// - `peek()` - 查看队首元素但不移除
// - `isEmpty()` - 检查是否为空
// - `size()` - 获取队列大小

// **技术实现：**
// - 基于二叉堆实现，时间复杂度为 O(log n)
// - 默认为最小堆，可通过比较函数自定义优先级规则
// - 支持任意类型的元素（数字、对象、字符串等）

// **使用场景：**
// 1. **数字优先队列** - 可以实现最小堆或最大堆
// 2. **任务调度** - 根据优先级处理任务
// 3. **算法应用** - Dijkstra算法、哈夫曼编码等
// 4. **字符串排序** - 按字典序处理

// 这个实现是线程安全的（在单线程JavaScript环境中），性能高效，API简洁易用。你可以根据具体需求调整比较函数来定制优先级规则。