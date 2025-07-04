var isSymmetric = function (root) {
  // 1. 递归
  if (!root) return true;

  const isMirror = (left, right) => {
    if (!left && !right) return true;
    if (!left || !right) return false;
    if (left.val !== right.val) return false;

    return isMirror(left.left, right.right) && isMirror(left.right, right.left);
  };

  return isMirror(root.left, root.right);

  // // 2. 迭代
  // if (!root) return true;
  // const queue = [root.left, root.right];
  // while (queue.length) {
  //   const left = queue.shift();
  //   const right = queue.shift();
  //   if (!left && !right) continue;
  //   if (!left || !right || left.val !== right.val) return false;
  //   queue.push(left.left, right.right, left.right, right.left);
  // }
  // return true;
};
