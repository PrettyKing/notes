/**
 * 广度优先遍历是一种基于队列的算法，用于遍历或搜索树或图的数据结构。
 * 
 * 该算法会先访问根节点，然后访问它的所有直接子节点。
 * 对于每个子节点，它会先访问它的所有直接子节点，
 * 然后访问它们的直接子节点，以此类推，直到遍历完所有的节点。

广度优先遍历通常用于寻找两个节点之间的最短路径，或者在树或图中查找某个元素。
在实现上，广度优先遍历需要维护一个队列，按照节点的访问顺序不断将节点添加到队列中。当队列为空时，遍历过程结束。

广度优先遍历的时间复杂度是$O(N)$，其中$N$是节点的数量。空间复杂度也是$O(N)$，
因为需要维护一个队列来存储访问过的节点。广度优先遍历是一种较为简单的遍历算法，但它需要占用较多的空间。


 */
// 定义二叉树节点类
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 创建二叉树
const root = new TreeNode(1);

root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.left = new TreeNode(6);
root.right.right = new TreeNode(7);

function bfs(node) {
  if (node === null) {
    return;
  }
  const queue = [node]; // 将根节点入队
  while (queue.length > 0) {
    const curr = queue.shift(); // 出队队头节点
    console.log(curr.val);
    if (curr.left !== null) {
      queue.push(curr.left); // 左子树入队
    }
    if (curr.right !== null) {
      queue.push(curr.right); // 右子树入队
    }
  }
}
bfs(root); // 输出：1 2 3 4 5 6 7

// 时间复杂度：$O(N)$，其中 $N$ 是二叉树节点的数量。每个节点都会被遍历一次，因此时间复杂度是线性的。
// 空间复杂度：$O(W)$，其中 $W$ 是二叉树的最大宽度。在最坏情况下，队列中需要存储二叉树的所有叶子节点，此时队列的长度达到 $W$，空间复杂度是线性的。
