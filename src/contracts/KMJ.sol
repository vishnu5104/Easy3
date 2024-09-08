// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ONFT721} from "@layerzerolabs/onft-evm/contracts/onft721/ONFT721.sol";

contract KMJ is ONFT721 {
    constructor(
        address _lzEndpoint,
        address _delegate
    ) ONFT721("KMJ", "JMN", _lzEndpoint, _delegate) {}
}
