//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Fomo {
    address owner;
    uint public start;
    uint public totalTime = 86400;
    uint public end;
    uint public keyPrice = 1 wei;
    uint public totalKeys;
    mapping(address => uint) public keyBalance;
    
    constructor() {
        owner = msg.sender;
    }
    
    function letTheGamesBegin() public {
        require(msg.sender == owner, "you cant start the game");
        start = block.timestamp;
        end = totalTime + start;
    }    
    function getBalance() public view returns(uint) {
        // retuns player's keyBalance
        return address(this).balance;
    }
    function purchaseKeys() public payable {
        require(msg.value >= keyPrice, "not enough to buy a key");
        keyBalance[msg.sender] += msg.value/keyPrice;
        keyPrice += msg.value;
    }
    function getKeyPrice() public view returns(uint) {
        return keyPrice;
    }
    function getTimeLeft() public view returns(uint) {
        return end - block.timestamp;
    }
    function withdrawMoney(address payable _to, uint _amount) public {
        require(_amount <= keyBalance[msg.sender], "not enough funds");
        keyBalance[msg.sender] -= _amount;
        _to.transfer(_amount);
    }
    function withdrawAllMoney(address payable _to) public {
        uint balanceToSend = keyBalance[msg.sender];
        keyBalance[msg.sender] = 0;
        _to.transfer(balanceToSend);
    }
}