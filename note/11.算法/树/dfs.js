/**
 *
深度优先遍历是一种常用的树（或图）遍历算法，也是一个递归的过程。该算法会先访问根节点，
然后访问它的所有子节点。对于每个子节点，它会先访问它的左子节点，然后访问右子节点。以此类推，直到遍历完所有的节点。

深度优先遍历有三种不同的方式：前序遍历、中序遍历和后序遍历。这些遍历方式的区别在于访问节点的顺序不同。

前序遍历：首先访问根节点，然后递归地访问左子树和右子树。对于二叉树，前序遍历的顺序是：根节点、左子节点、右子节点。
中序遍历：首先递归地访问左子树，然后访问根节点，最后递归地访问右子树。对于二叉树，中序遍历的顺序是：左子节点、根节点、右子节点。
后序遍历：首先递归地访问左子树和右子树，然后访问根节点。对于二叉树，后序遍历的顺序是：左子节点、右子节点、根节点。
深度优先遍历适合处理深度优先搜索（DFS）问题，例如求解连通性问题、路径问题等。在实现上，深度优先遍历通常使用递归或栈的方式实现。
 */
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

console.log(root);

function dfs(node) {
  if (node === null) {
    return;
  }
  console.log(node.val); // 访问节点
  dfs(node.left);
  dfs(node.right);
}
dfs(root); // 输出：1 2 4 5 3 6 7

// 时间复杂度：$O(N)$，其中 $N$ 是二叉树节点的数量。每个节点都会被遍历一次，因此时间复杂度是线性的。
// 空间复杂度：$O(H)$，其中 $H$ 是二叉树的高度。在最坏情况下，二叉树退化成链表，此时递归调用栈的深度达到 $H$，空间复杂度是线性的。
