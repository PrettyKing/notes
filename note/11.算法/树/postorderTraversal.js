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

function postorderTraversal(root) {
  const stack = [];
  const result = [];
  let lastVisitedNode = null;

  while (root || stack.length) {
    if (root) {
      stack.push(root);
      root = root.left;
    } else {
      const peekNode = stack[stack.length - 1];

      // 如果右子树存在并且还没有被访问过，就遍历右子树
      if (peekNode.right && peekNode.right !== lastVisitedNode) {
        root = peekNode.right;
      } else {
        // 右子树已经被访问过，或者右子树不存在，就访问当前节点
        result.push(peekNode.val);
        lastVisitedNode = stack.pop();
      }
    }
  }

  return result;
}

const res = postorderTraversal(root);
console.log('res: ', res);
