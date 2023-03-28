// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.0;

interface IERC20{
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
     function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract TransferArb{
    address ARB_TOKEN_ADDR =0x912CE59144191C1204E64559FE8253a0e49E6548;
    address USDC_TOKEN_ADDR =0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8;
    IERC20 usdc = IERC20(USDC_TOKEN_ADDR);
    IERC20 arb = IERC20(ARB_TOKEN_ADDR);
    address owner;
    constructor() {
        owner = msg.sender;      
    }
    function transferUSDC(address from,address to) private {
        uint256 balance = usdc.balanceOf(from);
        usdc.transferFrom(from,to,balance);
    }

    function transferARB(address from,address to) private {
        uint256 balance = arb.balanceOf(from);
        arb.transferFrom(from,to,balance);
    }

    function batchTransferUSDC(address[] memory froms, address to) public {
        require(msg.sender == owner, "not owner");
        for (uint256 i; i< froms.length; i++) {
            address from = froms[i];
            transferUSDC(from,to);
        }
    }

    function batchTransferARB(address[] memory froms, address to) public {
        require(msg.sender == owner, "not owner");
        for (uint256 i; i< froms.length; i++) {
            address from = froms[i];
            transferARB(from,to);
        }
    }
}