import { ethers } from "ethers";
import { ETH_WSS_URL, ARB_RPC_URL, ArbAccounts } from "../utils/helpers";
import { pksAddrsMe } from "../utils/pks";

async function claim(addr: string, pk: string, ARB_RPC_URL: string) {
  while (true) {
    try {
      const provider = new ethers.JsonRpcProvider(ARB_RPC_URL);
      const signer = new ethers.Wallet(pk, provider);
      const startTime = Date.now();
      const addrClaimContractAddress =
        "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9";
      const data = "0x4e71d92d";
      const gasLimit = 500000n;
      const nonce = await provider.getTransactionCount(addr);
      const balance = await provider.getBalance(addr);
      const claimTx = await signer.sendTransaction({
        to: addrClaimContractAddress,
        data: data,
        gasLimit: gasLimit,
        nonce: nonce,
      });
      const receipt = await claimTx.wait();
      console.log(`receipt is ${receipt!["hash"]}`);

      const endTime = Date.now();
      const ms = endTime - startTime;
      console.log(` 用时 is${ms} ms `);
      break;
    } catch (e) {
      console.log(`claim 出错${e}`);
    }
  }
}

export async function batchClaim(
  pksAddrsMe: Array<ArbAccounts>,
  ARB_RPC_URL: string
) {
  while (true) {
    try {
      const claimPromises = pksAddrsMe.map(async (account) => {
        const pk = account.pk;
        const addr = account.addr;
        return claim(addr, pk, ARB_RPC_URL);
      });
      await Promise.all(claimPromises);
      break;
    } catch (e) {
      console.log(`batchClaim出错${e}`);
    }
  }
}
export async function mainbatchClaim(
  pksAddrsMe: Array<ArbAccounts>,
  ARB_RPC_URL: string,
  ETH_WSS_URL: string
) {
  try {
    const providerETH = new ethers.WebSocketProvider(ETH_WSS_URL);
    let start = true;
    const onBlock = async (block: any) => {
      console.log(block);
      if (start == true && block >= 16890400) {
        // if (start == true && block >= 16887080) {
        start = false;
        await batchClaim(pksAddrsMe, ARB_RPC_URL);
      }
    };
    providerETH.on("block", onBlock);
  } catch (e) {
    console.log(`mainBatchTransferArb 出错${e}`);
  }
}

mainbatchClaim(pksAddrsMe, ARB_RPC_URL!, ETH_WSS_URL!).catch((e) => {
  console.log(e);
});
