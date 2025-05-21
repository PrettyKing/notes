// JavaScript实现背包问题

function findContentChildren(g, s) {
  let sum = s.reduce((prev, curr) => prev + curr, 0); // 计算所有饼干的总量

  let dp = new Array(sum + 1).fill(0); // 初始化动态规划数组

  // 对每个孩子进行循环
  for (let i = 0; i < g.length; i++) {
    // 从大到小更新动态规划数组
    for (let j = sum; j >= g[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - g[i]] + 1);
    }
  }

  // 找到能满足的最大孩子数量
  for (let i = sum; i >= 0; i--) {
    if (dp[i] <= g.length) {
      return dp[i];
    }
  }
  return 0;
}

// 胃口值
let g = [3];
// 饼干大小
let s = [2, 2];

console.log(findContentChildren(g, s)); // 输出：1
