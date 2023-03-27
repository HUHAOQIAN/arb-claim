import { ethers, MaxUint256, Wallet } from "ethers";

import * as dotenv from "dotenv";
dotenv.config();
import {
  ARB_TOKEN_ADDR,
  ArbAccounts,
  sleep,
  ARB_RPC_URL,
  getGasLimit,
  getGasPrice,
  CONTRACT_TRANSFER_ARB,
  ADDR_CB2C,
  USDC_TOKEN_ADDR,
} from "../utils/helpers";
import { pksAddrsMe } from "../utils/pks";
async function approveArb(
  addr: string,
  pk: string,
  ARB_RPC_URL: string,
  spenser: string
) {
  while (true) {
    try {
      const abi = [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function allowance(address owner, address spender) public view returns (uint256)",
      ];
      const provider = new ethers.JsonRpcProvider(ARB_RPC_URL);
      const signer = new Wallet(pk, provider);
      const arbTokenContract = new ethers.Contract(ARB_TOKEN_ADDR, abi, signer);
      const usdcTokenContract = new ethers.Contract(
        USDC_TOKEN_ADDR,
        abi,
        signer
      );
      const txData = arbTokenContract.interface.encodeFunctionData("approve", [
        spenser,
        MaxUint256,
      ]);
      // console.log(`gasprice is ${gasPrice}`);
      console.log(`${addr}开始授权 给 ${spenser}`);
      const balance = await provider.getBalance(addr);
      // const nonce = await provider.getTransactionCount(addr);
      if (balance > 200000000000000n) {
        await arbTokenContract.approve(spenser, MaxUint256);
        await usdcTokenContract.approve(spenser, MaxUint256);

        break;
      }
    } catch (e) {
      console.log(`approve 出错${e}`);
      await sleep(10000);
    }
  }
}

export async function batchApproveArb(
  pksAddrsMe: Array<ArbAccounts>,
  ARB_RPC_URL: string,
  spenser: string
) {
  while (true) {
    try {
      const transferPromises = pksAddrsMe.map(async (account) => {
        // const provider = new ethers.JsonRpcProvider(ARB_RPC_URL);
        const addr = account.addr;
        const pk = account.pk;
        console.log(addr);
        return approveArb(addr, pk, ARB_RPC_URL, spenser);
      });
      await Promise.all(transferPromises);
      console.log(`执行完毕`);
      break;
    } catch (e) {
      console.log(`batch 出错,重新执行`);
      await sleep(10000);
    }
  }
}
batchApproveArb(pksAddrsMe, ARB_RPC_URL!, CONTRACT_TRANSFER_ARB);
