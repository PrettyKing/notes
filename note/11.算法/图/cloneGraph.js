/**
 * // Definition for a _Node.
 * function _Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */
var cloneGraph = function (node) {
  if (!node) return null;

  const map = new Map();

  function dfs(node) {
    if (map.has(node.val)) return map.get(node.val);

    const newNode = { val: node.val, neighbors: [] };
    map.set(node.val, newNode);

    for (const neighbor of node.neighbors) {
      newNode.neighbors.push(dfs(neighbor));
    }

    return newNode;
  }

  return dfs(node);
};

var cloneGraph_ = function (node) {
  if (!node) return null;

  const map = new Map();

  function bfs(node) {
    const queue = [node];
    map.set(node.val, { val: node.val, neighbors: [] });

    while (queue.length > 0) {
      const currentNode = queue.shift();
      for (const neighbor of currentNode.neighbors) {
        if (!map.has(neighbor.val)) {
          map.set(neighbor.val, { val: neighbor.val, neighbors: [] });
          queue.push(neighbor);
        }
        map.get(currentNode.val).neighbors.push(map.get(neighbor.val));
      }
    }

    return map.get(node.val);
  }

  return bfs(node);
};
