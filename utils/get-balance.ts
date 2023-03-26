import { ethers } from "ethers";
import { pksAddrsMe } from "./pks";
import { ARB_RPC_URL } from "./helpers";
const provider = new ethers.JsonRpcProvider(ARB_RPC_URL);
async function getBlance() {
  console.log(pksAddrsMe.length);
  for (let i in pksAddrsMe) {
    const addr = pksAddrsMe[i]["addr"];
    const balance = await provider.getBalance(addr);
    console.log(`${addr} balance is ${balance}`);
  }
}
getBlance();
