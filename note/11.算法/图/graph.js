//       A
//      / \
//     B   C
//    / \   \
//   D   E   F
// 图的邻接表表示
const graph = {
  A: ['B', 'C'],
  B: ['D', 'E'],
  C: ['F'],
  D: [],
  E: [],
  F: [],
};

// 深度优先遍历（DFS）- 使用记忆化优化

function dfsMemoization(graph, start) {
  const visited = new Set();

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);
    console.log(node);

    for (const neighbor of graph[node]) {
      dfs(neighbor);
    }
  }

  dfs(start);
}
//dfsMemoization(graph, 'A');

//  时间复杂度 O(V+E)  V:顶点数，E:边数
// 空间复杂度 O(V)
// 广度优先遍历（BFS）- 使用优先级队列优化
function bfsPriorityQueue(graph, start) {
  const visited = new Set();
  const queue = [];
  queue.push(start);

  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    console.log(node);

    // 根据一些优先级规则对相邻节点进行排序，例如按字母顺序或节点值的大小等
    const neighbors = graph[node];

    for (const neighbor of neighbors) {
      queue.push(neighbor);
    }
  }
}

bfsPriorityQueue(graph, 'A');
