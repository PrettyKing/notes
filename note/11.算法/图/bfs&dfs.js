// 使用js实现图的深度优先搜索（DFS）和广度优先搜索（BFS）算法。
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    this.addVertex(vertex1);
    this.addVertex(vertex2);
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1); // 无向图
  }

  /**
   * 深度优先搜索, 从起始节点开始，访问所有相邻节点，直到没有未访问的节点为止。
   * @param {string} start - 起始节点
   * @param {Set} visited - 已访问的节点集合
   * @param {function} dfs - 递归函数
   * @returns {void}
   * @example
   * graph.dfs('A');
   * // 输出: A B D E C F G
   * */
  dfs(start, visited = new Set()) {
    if (!start || visited.has(start)) return;
    visited.add(start);
    console.log(start);
    for (const neighbor of this.adjacencyList[start]) {
      this.dfs(neighbor, visited);
    }
  }
  /**
   * 广度优先搜索, 从起始节点开始，访问所有相邻节点，然后再访问这些节点的相邻节点。
   * @param {string} start - 起始节点
   * @returns {void}
   * @example
   * graph.bfs('A');
   * // 输出: A B C D E F G
   * */
  bfs(start) {
    const queue = [start];
    const visited = new Set();
    visited.add(start);

    while (queue.length > 0) {
      const vertex = queue.shift();
      console.log(vertex);
      for (const neighbor of this.adjacencyList[vertex]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
}
// 使用示例
const graph = new Graph();
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "D");
graph.addEdge("B", "E");
graph.addEdge("C", "F");
graph.addEdge("C", "G");
console.log("DFS:");
graph.dfs("A"); // 深度优先搜索
console.log("BFS:");
graph.bfs("A"); // 广度优先搜索
