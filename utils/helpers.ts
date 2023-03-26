import * as dotenv from "dotenv";
dotenv.config();
import axios from "axios";
export const CONTRACT_TRANSFER_ARB = ""; //自行部署的transfer-arb.sol 合约地址
export const ARB_RPC_URL = process.env.ARBI_RPC_URL;
export const ETH_RPC_URL = process.env.ETH_RPC_URL;
export const ETH_WSS_URL = process.env.ETH_WSS_URL;
export const GWEI = 10n ** 9n;
export const ARB_TOKEN_ADDR = "0x912CE59144191C1204E64559FE8253a0e49E6548";
export const USDC_TOKEN_ADDR = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
export const ARB_CLAIME_CONTRACT_ADDR =
  "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9";
export const ARBI_WSS_URL = process.env.ARBI_WSS_URL;
export const OkexMeArb = "";
export const ADDR_CB2C = ""; //被盗私钥地址授权的合约
export type ArbAccounts = {
  addr: string;
  pk: string;
};
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getGasPrice() {
  const data = { jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1 };
  const res = await axios.request({
    method: "POST",
    url: ARB_RPC_URL,
    data: data,
  });
  const hexString = res.data["result"];
  const uintValue = hexString.startsWith("0x") ? hexString : `0x${hexString}`;
  const gasPrice = parseInt(uintValue, 16);
  console.log(`gasPrice is ${gasPrice}`);
  return BigInt(gasPrice);
}
export async function getGasLimit(to: string, data: string) {
  const dataTx = {
    jsonrpc: "2.0",
    method: "eth_estimateGas",
    params: [{ to: to, data: data }],
    id: 1,
  };
  const res = await axios.request({
    method: "POST",
    url: ARB_RPC_URL,
    data: dataTx,
  });
  const hexString = res.data["result"];
  console.log(hexString);
  const uintValue = hexString.startsWith("0x") ? hexString : `0x${hexString}`;
  const gasLimit = parseInt(uintValue, 16);
  console.log(`gasLimit is ${gasLimit}`);
  return BigInt(gasLimit);
}
