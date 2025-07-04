var climbStairs = function (n) {
  if (n == 1) {
    return 1;
  }
  // // 斐波那契数列，第三个数字等于前两个数字之和 O(logn)
  // let frist = 1
  // let second = 2

  // for(let i= 3;i<=n;i++){
  //     let third = frist + second
  //     frist = second
  //     second = third
  // }

  // return second

  let arr = [];
  arr[1] = 1;
  arr[2] = 2;
  for (let i = 3; i <= n; i++) {
    arr[i] = arr[i - 1] + arr[i - 2];
  }
  return arr[n];
};
