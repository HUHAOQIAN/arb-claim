import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import { ARB_TOKEN_ADDR, ArbAccounts, ARB_RPC_URL } from "../utils/helpers";
import { OkexMeArb, ETH_WSS_URL } from "../utils/helpers";
import { pksAddrsMe } from "../utils/pks";
export async function getArbBalance(
  addr: string,
  ARB_RPC_URL: string,
  token: string
) {
  while (true) {
    try {
      const abi = [
        " function balanceOf(address account) external view returns (uint256)",
      ];
      const provider = new ethers.JsonRpcProvider(ARB_RPC_URL);
      const arbTokenContract = new ethers.Contract(token, abi, provider);
      const balance = await arbTokenContract.balanceOf(addr);
      console.log(balance);
      return balance;
    } catch (e) {
      console.log(`getArbBalance 出错${e}`);
    }
  }
}

async function transferArb(
  addr: string,
  pk: string,
  okexAddr: string,
  ARB_RPC_URL: string
) {
  while (true) {
    try {
      const abi = [
        "function transfer(address to, uint256 amount) external returns (bool)",
      ];
      const provider = new ethers.JsonRpcProvider(ARB_RPC_URL);
      const signer = new Wallet(pk, provider);
      const balance = await getArbBalance(addr, ARB_RPC_URL, ARB_TOKEN_ADDR);
      if (balance > 0) {
        console.log(`检测到ARB余额，开始转账到okex`);
        const arbTokenContract = new ethers.Contract(
          ARB_TOKEN_ADDR,
          abi,
          signer
        );
        const res = await arbTokenContract.transfer(okexAddr, balance, {
          gasPrice: 10n ** 9n * 100n,
        });
        const receipt = await res.wait();
        console.log(
          `receipt is ${JSON.stringify(receipt["hash"])}, blockNumber is  ${
            receipt["blockNumber"]
          }`
        );
      } else {
        console.log(`${addr} arb 余额为0`);
      }
    } catch (e) {
      console.log(`transferArb 出错${e}`);
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
        return transferArb(addr, pk, OkexMeArb, ARB_RPC_URL);
      });
      await Promise.all(transferPromises);
      console.log(`执行完毕`);
      break;
    } catch (e) {
      console.log(`batch 出错,重新执行`);
    }
  }
}

export async function mainBatchTransferArb(
  pksAddrsMe: Array<ArbAccounts>,
  OkexMeArb: string,
  ARB_RPC_URL: string,
  ARBI_WSS_URL: string
) {
  try {
    const provider = new ethers.WebSocketProvider(ARBI_WSS_URL);
    let start = true;
    const onBlock = async (block: any) => {
      console.log(block);
      if (start == true) {
        start = false;
        await batchTransferArb(pksAddrsMe, OkexMeArb, ARB_RPC_URL);
      }
    };
    provider.on("block", onBlock);
  } catch (e) {
    console.log(`mainBatchTransferArb 出错${e}`);
  }
}

mainBatchTransferArb(pksAddrsMe, OkexMeArb, ARB_RPC_URL!, ETH_WSS_URL!);
