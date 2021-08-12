//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract FomoOE {
    address owner;
    uint public balanceReceived;
    uint public keyPrice = 100 wei;
    uint public totalKeys;
    mapping(address => uint) public keyBalance;
    
    event keysPurchased(uint _userKeyBalance, uint _totalKeys, uint _keyPrice);
    event contractBalance(uint _balanceReceived);
    event currentKeyPrice(uint keyPrice);
    constructor() {
        owner = msg.sender;
    }

    function receiveMoney() public payable {
        balanceReceived += msg.value;
        emit contractBalance(address(this).balance);
    }
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    function withdrawMoney() public {
        address payable to = payable(msg.sender);
        to.transfer(getBalance());
        emit contractBalance(address(this).balance);
    }
    function withdrawMoneyTo(address payable _to) public {
        _to.transfer(getBalance());
    }

    function purchaseKeys(uint _amount) public payable {
        // require(msg.value*_amount == keyPrice*_amount, "not enough to buy the key(s).");
        keyBalance[msg.sender] += _amount;
        totalKeys += _amount;
        keyPrice = keyPrice + _amount;
        emit keysPurchased(keyBalance[msg.sender], totalKeys, keyPrice);   
        // emit currentKeyPrice(keyPrice);
    } 
    function getTotalKeyBalance() public view returns(uint) {
        return totalKeys;
    }
    function getUserKeyBalance() public view returns(uint) {
        return keyBalance[msg.sender];
    }

    function getKeyPrice() public view returns(uint) {
        return keyPrice;
    }

}