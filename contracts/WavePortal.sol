// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    address[] public waveAddresses;

    constructor() {
        console.log("Hey there, by contract I am smart");
    }

    function wave() public {
        totalWaves += 1;
        waveAddresses.push(msg.sender);
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getWaveAddresses() public view returns (address[] memory) {
        console.log("This is the list of wave addresses:");
        for (uint256 i = 0; i < waveAddresses.length; i++) {
            console.log(waveAddresses[i]);
        }
        return waveAddresses;
    }
}
