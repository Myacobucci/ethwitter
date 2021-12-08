// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract EthwitterPortal {
    uint256 totalEthweets;
    uint256 private seed;

    address[] public ethweetAddresses;
    struct Ethweet {
        address sender;
        string message;
        uint256 timestamp;
    }
    Ethweet[] ethweets;

    event NewEthweet(address indexed from, uint256 timestamp, string message);

    constructor() payable {
        console.log("Hey there, by contract I am smart");
        seed = (block.timestamp + block.difficulty) % 100;
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

        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        if (seed <= 5) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.00001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
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
