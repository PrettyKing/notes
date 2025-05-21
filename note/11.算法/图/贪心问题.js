function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let child = 0;
  let cookie = 0;
  while (child < g.length && cookie < s.length) {
    if (g[child] <= s[cookie]) {
      child++;
    }
    cookie++;
  }
  return child;
}

// 胃口值
let g = [3];
// 饼干大小
let s = [2, 2];

console.log(findContentChildren(g, s)); // 输出：0
