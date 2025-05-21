// 时间复杂度是$O(n)$，其中$n$是树的节点数。因为每个节点最多入栈一次，出栈一次，所以时间复杂度与树的节点数成正比。
// 时间复杂度是$O(h)$，其中$h$是树的高度。因为在栈中同时最多存储$h$个节点（当树为链表时），所以空间复杂度与树的高度成正比。
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

function preorderTraversal(root) {
  if (!root) return [];
  const stack = [root];
  const res = [];

  while (stack.length) {
    const node = stack.pop();
    res.push(node.val);

    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return res;
}

const res = preorderTraversal(root);
console.log('res: ', res);
