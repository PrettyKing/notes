//时间复杂度是 $O(N)$，空间复杂度是 $O(H)$，其中 $N$ 是二叉树中节点的总数，$H$ 是二叉树的高度。
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
function inorderTraversal(root) {
  const stack = [];
  let curr = root;
  const res = [];

  while (stack.length || curr) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    res.push(curr.val);
    curr = curr.right;
  }

  return res;
}
const res = inorderTraversal(root);
console.log('res: ', res);
