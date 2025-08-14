// 并查集
class UF {
  constructor(size) {
    this.parents = Array(size)
      .fill(0)
      .map((_, i) => i);
    this.sizes = Array(size).fill(1);
    this.cnt = size;
  }
  // 得到集合数量
  getSizeOfSet(x) {
    const px = this.findSet(x);
    return this.sizes[px];
  }
  // 查找元
  findSet(x) {
    if (x !== this.parents[x]) {
      // 路径优化，在findSet进⾏ 会将这个节点到元的所有元素的parents指向元
      this.parents[x] = this.findSet(this.parents[x]);
    }
    return this.parents[x];
  }
  // 合并集合
  unionSet(x, y) {
    if (this.connected(x, y)) return;
    const px = this.findSet(x);
    const py = this.findSet(y);
    // 将较短的集合的元的parents指向较⻓的集合的元
    if (this.sizes[px] > this.sizes[py]) {
      this.parents[py] = px;
      this.sizes[px] += this.sizes[py];
    } else {
      this.parents[px] = py;
      this.sizes[py] += this.sizes[px];
    }
    this.cnt -= 1;
  }
  // 连通性
  connected(x, y) {
    return this.findSet(x) === this.findSet(y);
  }
}
