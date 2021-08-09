//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract FomoOE {
    address owner;
    uint public balanceReceived;
    uint public keyPrice = 100 wei;
    uint public totalKeys;
    mapping(address => uint) public keyBalance;
    
    event keysPurchased(address _by, uint _amount);
    event contractBalance(uint _balanceReceived);
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
        require(msg.value*_amount == keyPrice*_amount, "not enough to buy the key(s).");
        keyBalance[msg.sender] += _amount;
        // keyPrice = keyPrice + _amount;
        emit keysPurchased(msg.sender, _amount);   
    } 
    function getKeyBalance() public view returns(uint) {
        return keyBalance[msg.sender];
    }
    
    function getKeyPrice() public view returns(uint) {
        return keyPrice;
    }

}