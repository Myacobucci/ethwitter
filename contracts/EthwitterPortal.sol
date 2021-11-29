// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract EthwitterPortal {
    uint256 totalEthweets;
    address[] public ethweetAddresses;

    constructor() {
        console.log("Hey there, by contract I am smart");
    }

    function ethweet() public {
        totalEthweets += 1;
        ethweetAddresses.push(msg.sender);
        console.log("%s has sent an ETHweet!", msg.sender);
    }

    function getTotalEthweets() public view returns (uint256) {
        console.log("We have %d total ETHweets!", totalEthweets);
        return totalEthweets;
    }

    function getEthweetAddresses() public view returns (address[] memory) {
        console.log("This is the list of ETHweet addresses:");
        for (uint256 i = 0; i < ethweetAddresses.length; i++) {
            console.log(ethweetAddresses[i]);
        }
        return ethweetAddresses;
    }
}
