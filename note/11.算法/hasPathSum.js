// var hasPathSum = function(root, targetSum) {
//     if (!root) return false;
//     targetSum -= root.val;

//     // 如果是叶子节点，检查是否满足条件
//     if (!root.left && !root.right) {
//         return targetSum === 0;
//     }

//     // 递归检查左子树和右子树
//     return hasPathSum(root.left, targetSum) || hasPathSum(root.right, targetSum);
// }
// 时间复杂度是 O(N)，空间复杂度是 O(H)，其中 N 是二叉树中节点的总数，H 是二叉树的高度。

// 非递归解法
var hasPathSum = function(root, targetSum) {
    if (!root) return false;
    
    const stack = [];
    let curr = root;
    let sum = 0;

    while (stack.length || curr) {
        while (curr) {
            stack.push({ node: curr, sum: sum + curr.val });
            curr = curr.left;
        }
        
        const { node, sum: currentSum } = stack.pop();
        curr = node.right;

        // 如果是叶子节点，检查是否满足条件
        if (!node.left && !node.right && currentSum === targetSum) {
            return true;
        }
        
        sum = currentSum; // 更新当前路径和
    }

    return false;
};