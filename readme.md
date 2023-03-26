## 实现回顾

帮朋友从黑客手中抢回了十多个私钥泄露的 arb，由于 arb 是 FIFS 机制，只能拼节点速度，而且黑客也比较快，gas 转入 1 秒就会被转出，所以做了多个脚本，思路是，
1：提前先把私钥泄露的地址给自己的合约授权，然后转空私钥内的 gas:
2：到达制定区块开启 claim 后，往私钥内打刚刚够 claim 的 gas，并监控合约地址内的 arb，合约转出。
3：同时开启私钥转出 arb，如果黑客比我快，往里打入更多 gas， claim 出来可以第一时间转出 arb。
4：并且开启 gas 监控转出。防止黑客忘里打入 gas 并且 claim

## 5 个脚本

[监控区块，到达制定区块批量 claim](src/claim.ts)

[提前批量授权给 自己部署的批量转出合约](src/aprrove.ts)

[批量监控地址内 arb，并且转出](src/transfer-arb.ts)

[监控地址内 arb，并通过合约批量转出](src/transferARB-with-contract.ts)

![示例图片](https://raw.githubusercontent.com/HUHAOQIAN/arb-claim/blob/master/images/arb.png)
