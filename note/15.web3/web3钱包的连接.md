# 写一段JavaScript代码连接上MetaMask，并显示钱包余额

> 首先要确定用户已经在浏览器中安装了MetaMask插件

``` js
async function  connectMetaMaskAndGetBalance(){
    // 检查用户是否装了MetaMask
    if (typeof window.ethereum !== 'undefined'){
        console.log('MetaMask is installed!');
        
        // 连接到 MetaMask
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log('Connected account:', account);
            // 获取钱包余额
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest']
            });
            // 将余额从 Wei 转换为 Ether
            const balanceInEther = ethereum.utils.fromWei(balance, 'ether');
            console.log('Wallet balance:', balanceInEther, 'ETH');
            // 在页面上显示余额
            document.getElementById('balance').innerText = `Wallet balance: ${balanceInEther} ETH`;
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    }else {
        console.log('Please install MetaMask!');
    } 
    
}   
connectMetaMaskAndGetBalance()
```
``` html
<div id="balance">Balance:</div>
```

需要注意的是：
1. 这段代码需要在用户的上下文中执行，例如作为按钮点击事件的响应，因为最新的浏览器的安全策略限制了自动弹出MetaMask请求；
2. ```ethereum.request({ method: 'eth_requestAccounts' })```将触发MetaMask的弹窗，要求用户授权其连接其账户；
3. 该示例只连接到以太坊的主网；
4. ```ethereum.utils.fromWei(balance, 'ether')```用于将余额从wei转换为更容易读懂的ether，这需要web3.js或ethers.js库的支持，或者可以自己实现转换逻辑。