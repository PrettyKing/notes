// js api 解法
// var topKFrequent = function(nums, k) {
//     let map = new Map()
//     for(let i=0;i<nums.length;i++){
//         if(map.has(nums[i])){
//             map.set(nums[i],map.get(nums[i])+1)
//         }else{
//             map.set(nums[i],1)
//         }
//     }
//     return Array.from(map).sort((a,b)=>b[1]-a[1]).slice(0,k).map(i=>i[0])
// };
// 非js api 解法
// 这道题目主要涉及到如下三块内容：
// 要统计元素出现频率
// 对频率排序
// 找出前K个高频元素
// 优先队列  最小顶堆解法 
var topKFrequent = function(nums, k) {
    // 使用 Map 来统计每个数字的频率
    const map = new Map();
    for (const num of nums) {
        map.set(num, (map.get(num) || 0) + 1);
    }

    // 使用最小堆来存储前 k 个高频元素
    // 最小堆的实现可以使用数组和排序来模拟
    const minHeap = [];
    for (const [num, freq] of map.entries()) {
        if (minHeap.length < k) {
            minHeap.push([num, freq]);
            minHeap.sort((a, b) => a[1] - b[1]); // 保持最小堆性质
        } else if (freq > minHeap[0][1]) {
            minHeap[0] = [num, freq];
            minHeap.sort((a, b) => a[1] - b[1]); // 重新排序
        }
    }
    // 返回前 k 个高频元素
    return minHeap.map(item => item[0]);
}