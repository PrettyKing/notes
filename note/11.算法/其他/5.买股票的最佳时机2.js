var maxProfit = function (prices) {
  let n = prices.length;
  if (n < 2) return 0;

  let buy = -prices[0];
  let sell = 0;
  let res = 0;
  for (let i = 1; i < n; i++) {
    buy = Math.max(buy, sell - prices[i]);
    sell = Math.max(sell, buy + prices[i]); // 这里的sell是前一天的sell
    res = Math.max(res, sell);
  }
  return res;
};
