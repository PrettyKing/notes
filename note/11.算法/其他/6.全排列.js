function swap(nums,i,j){
    let temp = nums[i]
    nums[i] = nums[j]
    nums[j] = temp
}

function dfs(nums,pos,list,result){
    if(list.length == nums.length){
        result.push(list.slice())
        return
    }
    for(let i=pos;i<nums.length;i++){
        list.push(nums[i])
        swap(nums,pos,i)
        dfs(nums,pos+1,list,result)
        swap(nums,pos,i)
        list.pop()
    }
}

var permute = function(nums) {
    let result = []
    let list = []
    dfs(nums,0,list,result)
    return result
};