import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import {
  CONTRACT_TRANSFER_ARB,
  ArbAccounts,
  sleep,
  ARB_RPC_URL,
  USDC_TOKEN_ADDR,
  ARB_TOKEN_ADDR,
  ADDR_CB2C,
} from "../utils/helpers";
import { pksAddrsMe } from "../utils/pks";
import { getArbBalance } from "./transfer-arb";

// console.log(pk);
async function getAddresses(pksAddrsMe: Array<ArbAccounts>) {
  const addresses: Array<string> = [];
  for (let i in pksAddrsMe) {
    const addr = pksAddrsMe[i]["addr"];
    addresses.push(addr);
  }
  return addresses;
}

async function transferArbWithContract(
  pksAddrsMe: Array<ArbAccounts>,
  ARB_RPC_URL: string,
  to: string
) {
  while (true) {
    try {
      const abi = [
        "function batchTransferUSDC(address[] memory froms, address to) public",
        "function batchTransferARB(address[] memory froms, address to) public",
      ];
      const provider = new ethers.JsonRpcProvider(ARB_RPC_URL);
      const pk = process.env.PRIVATE_KEY_AB2C!;
      const signer = new Wallet(pk, provider);
      const arbTokenContract = new ethers.Contract(
        CONTRACT_TRANSFER_ARB,
        abi,
        signer
      );

      const addresses = await getAddresses(pksAddrsMe);
      while (true) {
        const promises = addresses.map((address) =>
          getArbBalance(address, ARB_RPC_URL!, ARB_TOKEN_ADDR)
        );

        const balances = await Promise.all(promises);

        for (let i in balances) {
          const balance = balances[i];
          console.log(`addr${addresses[i]} balance is ${balance}`);
          if (balance > 0) {
            const nonce = await provider.getTransactionCount(ADDR_CB2C);
            console.log(addresses);
            const res = await arbTokenContract.batchTransferARB(addresses, to, {
              nonce: nonce,
              gasPrice: 10n ** 9n * 100n,
            });
            const receipt = await res.wait();
            console.log(receipt);
          }
        }
      }
    } catch (e) {
      console.log(`getArbBalance 出错${e}`);
    }
  }
}
transferArbWithContract(pksAddrsMe, ARB_RPC_URL!, ADDR_CB2C);
