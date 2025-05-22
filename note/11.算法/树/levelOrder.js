// 102.二叉树的层序遍历
// https://leetcode.cn/problems/binary-tree-level-order-traversal/
// 给你二叉树的根节点 root ，返回其节点值的 层序遍历 。
// （即逐层地，从左到右访问所有节点）。
function levelOrder(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}
