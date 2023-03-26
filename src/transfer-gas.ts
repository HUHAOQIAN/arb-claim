import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
import { pksAddrsMe } from "../utils/pks";
import axios from "axios";
dotenv.config();
import {
  ArbAccounts,
  ARB_RPC_URL,
  ADDR_CB2C,
  getGasLimit,
  getGasPrice,
} from "../utils/helpers";
const WEI = 1n;
export async function transferGas(
  addr: string,
  pk: string,
  okexAddr: string,
  ARB_RPC_URL: string
) {
  while (true) {
    try {
      const provider = new ethers.JsonRpcProvider(ARB_RPC_URL);
      const signer = new Wallet(pk, provider);
      const balance = await provider.getBalance(addr);
      console.log(`${addr} balance is ${balance}`);
      const gasLimit = await getGasLimit(ADDR_CB2C, "0x");
      const gasPrice = await getGasPrice();
      console.log(`当前主网 gasPrice 为 ${gasPrice}, gaslimit 为 ${gasLimit}`);
      // const gasLimit = 220000n;
      // const gasPrice = 100000000n;
      const value = balance - gasLimit * gasPrice;
      if (value > 0) {
        console.log(`${addr}检测到GAS余额，开始转账到okex`);
        await signer.sendTransaction({
          to: okexAddr,
          value: value,
          gasLimit: gasLimit,
          gasPrice: 60000000n,
        });
        break;
      } else {
        console.log(`${addr} value 余额为 ${value}`);
        // await sleep(100);
      }
    } catch (e) {
      console.log(`${addr}transferGas 出错${e}`);
    }
  }
}

export async function batchTransferArb(
  pksAddrsMe: Array<ArbAccounts>,
  OkexMeArb: string,
  ARB_RPC_URL: string
) {
  while (true) {
    try {
      const transferPromises = pksAddrsMe.map(async (account) => {
        const addr = account.addr;
        const pk = account.pk;
        console.log(addr);
        return transferGas(addr, pk, OkexMeArb, ARB_RPC_URL);
      });
      await Promise.all(transferPromises);
      console.log(`执行完毕`);
    } catch (e) {
      console.log(`batch 出错,重新执行`);
    }
  }
}

batchTransferArb(pksAddrsMe, ADDR_CB2C, ARB_RPC_URL!);
