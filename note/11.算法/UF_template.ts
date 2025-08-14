// 并查集TS版本
class UnionFind {
    private parents: Array<number>;
    private sizes: Array<number>;
    constructor(size: number) {
        this.parents = Array(size)
            .fill(0)
            .map((_, i) => i);
        this.sizes = Array(size).fill(1);
    }
    getSizeOfSet(x: number): number {
        const px = this.findSet(x);
        return this.sizes[px];
    }
    findSet(x: number): number {
        if (x !== this.parents[x]) {
            this.parents[x] = this.findSet(this.parents[x]);
        }
        return this.parents[x];
    }
    unionSet(x: number, y: number): void {
        const px: number = this.findSet(x);
        const py: number = this.findSet(y);
        if (px === py) return;
        if (this.sizes[px] > this.sizes[py]) {
            this.parents[py] = px;
            this.sizes[px] += this.sizes[py];
        } else {
            this.parents[px] = py;
            this.sizes[py] += this.sizes[px];
        }
    }
}