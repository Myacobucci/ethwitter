// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract EthwitterPortal {
    uint256 totalEthweets;
    address[] public ethweetAddresses;
    struct Ethweet {
        address waver;
        string message;
        uint256 timestamp;
    }
    Ethweet[] ethweets;

    event NewEthweet(address indexed from, uint256 timestamp, string message);

    constructor() {
        console.log("Hey there, by contract I am smart");
    }

    function ethweet(string memory _message) public {
        totalEthweets += 1;
        ethweetAddresses.push(msg.sender);
        console.log(
            "%s has sent an ETHweet with the message: %s",
            msg.sender,
            _message
        );

        ethweets.push(Ethweet(msg.sender, _message, block.timestamp));

        emit NewEthweet(msg.sender, block.timestamp, _message);
    }

    function getAllEthweets() public view returns (Ethweet[] memory) {
        return ethweets;
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
