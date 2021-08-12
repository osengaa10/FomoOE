import React, { Component } from "react";
// import ItemManagerContract from "./contracts/ItemManager.json";
import FomoContract from "./contracts/FomoOE.json";
import getWeb3 from "./getWeb3";
import {Button, Badge, Alert} from 'react-bootstrap';

import "./App.css";

class App extends Component {
  state = { 
    loaded: false, 
    deposit: 0, 
    withdraw: 0, 
    total: 0,
    totalKeyBalance: 0,
    userKeyBalance: 0,
    userKeyPurchaseAmount: 0,
    keyPrice: 100
   };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();
      console.log("this.web3: ");
      console.log(this.web3);

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();
      console.log("this.accounts: ");
      console.log(this.accounts);

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      console.log("this.networkId: ");
      console.log(this.networkId);

      this.fomo = new this.web3.eth.Contract(
        FomoContract.abi,
        FomoContract.networks[this.networkId] && FomoContract.networks[this.networkId].address,
      );
      console.log("this.fomo: ");
      console.log(this.fomo);
      
      console.log("CONTRACT_ADDRESS:");
      this.CONTRACT_ADDRESS = FomoContract.networks[this.networkId].address
      // this.item = new this.web3.eth.Contract(
      //   ItemContract.abi,
      //   ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      // );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.listenToPaymentEvent();
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
    this.listenToDepositEvent();
    this.listenToKeyPurchaseEvent();

    this.getContractBalance();
    this.getUserKeyBalance();
    this.getTotalKeyBalance();
    this.getKeyPrice();
  };

  // listenToPaymentEvent = () => {
  //   let self = this;
  //   this.fomo.events.SupplyChainStep().on("data", async function(evt) {
  //     if(evt.returnValues._step === 1) {
  //       let item = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
  //       console.log(item);
  //       alert("Item " + item._identifier + " was paid, deliver it now!");
  //     };
  //     console.log(evt);
  //   });
  // }
  listenToDepositEvent = () => {
    this.fomo.events.contractBalance().on("data", async (evt) => {
      // console.log(evt.returnValues._balanceReceived);
      // let totalBalance = await this
      this.setState({ withdraw: evt.returnValues._balanceReceived }); 
      console.log("this.state.withdraw:");   
      console.log(this.state.withdraw);  
    });

  }

  listenToKeyPurchaseEvent = () => {
    this.fomo.events.keysPurchased().on("data", async (evt) => {
      // console.log(evt.returnValues._balanceReceived);
      // let totalBalance = await this
      this.setState({ userKeyBalance: evt.returnValues._userKeyBalance }); 
      this.setState({ totalKeyBalance: evt.returnValues._totalKeys });
      this.setState({ keyPrice: evt.returnValues._keyPrice })
      console.log("this.state.userKeyBalance:");   
      console.log(this.state.userKeyBalance);  
    });

  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    console.log("event: ");
    console.log(event);
    this.setState({
      deposit: event.target.value
    });
  }

  handleSubmit = async() => {
    console.log("this.state.deposit:");
    console.log(this.state.deposit);
    let result = await this.fomo.methods.receiveMoney().send({
      from: this.accounts[0], 
      to: this.CONTRACT_ADDRESS, 
      value: this.web3.utils.toWei(this.state.deposit, "ether")
    });
    console.log("result: ")
    console.log(result);

  }

  handleWithdraw = async() => {
    let withdraw = await this.fomo.methods.withdrawMoney().send({
      from: this.accounts[0]
    })
      .then(console.log)
    console.log(withdraw);
      
  }


  getContractBalance = async() => {
    let balanceResult = await this.fomo.methods.getBalance().call()
    this.setState({ withdraw: balanceResult });
    console.log("balanceResult");
    console.log(balanceResult);
  }

  getUserKeyBalance = async() => {
    let getUserKeyBalanceResult = await this.fomo.methods.getUserKeyBalance().call()
    this.setState({ userKeyBalance: getUserKeyBalanceResult });
    console.log("getUserKeyBalanceResult");
    console.log(getUserKeyBalanceResult);
  }


  getTotalKeyBalance = async() => {
    let getTotalKeyBalanceResult = await this.fomo.methods.getTotalKeyBalance().call()
    this.setState({ totalKeyBalance: getTotalKeyBalanceResult });
    console.log("getTotalKeyBalanceResult");
    console.log(getTotalKeyBalanceResult);
  }

  getKeyPrice = async() => {
    let getKeyPriceResult = await this.fomo.methods.getKeyPrice().call()
    this.setState({ keyPrice: getKeyPriceResult });
    console.log("getKeyPriceResult");
    console.log(getKeyPriceResult);
  }


  handleKeyAmountChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    console.log("event: ");
    console.log(event);
    this.setState({
      userKeyPurchaseAmount: event.target.value
    });
  }

  handlePurchaseKeys = async() => {
    console.log("this.state.userKeyPurchaseAmount:");
    console.log(this.state.userKeyPurchaseAmount);
    let amountToPay = this.state.userKeyPurchaseAmount*this.state.keyPrice;
    console.log("amountToPay:");
    console.log(amountToPay);
    let result = await this.fomo.methods.purchaseKeys(this.state.userKeyPurchaseAmount).send({
      from: this.accounts[0], 
      to: this.CONTRACT_ADDRESS, 
      value: amountToPay
    });
    console.log("handlePurchaseKeys result: ")
    console.log(result);

  }

  
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>FomoOE</h1>
        <h2></h2>
        <h2>Amount in Contract: {this.state.withdraw} wei</h2>
        <div className="d-grid gap-2">
        Amount to deposit: <input type="number" name="deposit" value={this.state.deposit} onChange={this.handleInputChange} />
        <Button variant="danger" type="button" onClick={this.handleSubmit}>Deposit</Button>{' '}
        <Button variant="success" size="lg" onClick={this.handleWithdraw}>Withdraw</Button>
        {/* <Button variant="info" type="button" onClick={this.getContractBalance}>Get Contract Balance</Button> */}
        </div>
        <div className="d-grid gap-2">
          <h2>Total Keys Bought: {this.state.totalKeyBalance}</h2>
          <h3>Current Key Price: {this.state.keyPrice}</h3>
          Amount of keys to buy: <input type="number" name="userKeyPurchaseAmount" value={this.state.userKeyPurchaseAmount} onChange={this.handleKeyAmountChange} />
          <Button variant="info" type="button" onClick={this.handlePurchaseKeys}>Buy Keys!!!</Button>{' '}
          <Alert >
              Keys owned: {this.state.userKeyBalance}
          </Alert>
        </div>
      </div>
    );
  }
}

export default App;
