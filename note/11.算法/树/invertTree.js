var invertTree = function (root) {
  // 1. 递归 (O(n) O(n))(76 ms 38.6 MB)(97.99% 5.18%)
  if (!root) return root;
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;
  root.right = left;
  return root;

  // // 2. 迭代 (O(n) O(n))(80 ms 38.5 MB)(93.25% 5.18%)
  // if (!root) return root;
  // const stack = [root];
  // while (stack.length) {
  //   const node = stack.pop();
  //   const left = node.left;
  //   node.left = node.right;
  //   node.right = left;
  //   if (node.left) stack.push(node.left);
  //   if (node.right) stack.push(node.right);
  // }
  // return root;
};
