import React, { Component, useState, useEffect } from "react";
// import ItemManagerContract from "./contracts/ItemManager.json";
import FomoContract from "./contracts/FomoOE.json";
import getWeb3 from "./getWeb3";
import {Button, Container, Alert, Row, Col} from 'react-bootstrap';

import "./App.css";

function App() {

  const [loaded, setLoaded] = useState(false);
  const [deposit, setDeposit] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalKeyBalance, setTotalKeyBalance] = useState(0);
  const [userKeyBalance, setUserKeyBalance] = useState(0);
  const [userKeyPurchaseAmount, setUserKeyPurchaseAmount] = useState(0);
  const [keyPrice, setKeyPrice] = useState(100);

  useEffect(() => {
    init();
  }, []);

  const init = async() => {
    try {
      // Get network provider and web3 instance.
      let web3 = await getWeb3();
      console.log("this.web3: ");
      console.log(this.web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("this.accounts: ");
      console.log(this.accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("this.networkId: ");
      console.log(this.networkId);

      const fomo = new web3.eth.Contract(
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
      setLoaded(true);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
    listenToDepositEvent();
    listenToKeyPurchaseEvent();

    getContractBalance();
    getUserKeyBalance();
    getTotalKeyBalance();
    getKeyPrice();
  };
  const listenToDepositEvent = () => {
    this.fomo.events.contractBalance().on("data", async (evt) => {
      // console.log(evt.returnValues._balanceReceived);
      // let totalBalance = await this
      setWithdraw(evt.returnValues._balanceReceived);
      console.log("withdraw:");   
      console.log(withdraw);  
    });

  }

  const listenToKeyPurchaseEvent = () => {
    this.fomo.events.keysPurchased().on("data", async (evt) => {
      // console.log(evt.returnValues._balanceReceived);
      // let totalBalance = await this
      setUserKeyBalance(evt.returnValues._userKeyBalance);
      setTotalKeyBalance(evt.returnValues._totalKeys);
      setKeyPrice(evt.returnValues._keyPrice);
      console.log("userKeyBalance:");   
      console.log(userKeyBalance);  
    });

  }

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    console.log("event: ");
    console.log(event);
    setDeposit(event.target.value);
  }

  const handleSubmit = async() => {
    console.log("deposit:");
    console.log(deposit);
    let result = await this.fomo.methods.receiveMoney().send({
      from: this.accounts[0], 
      to: this.CONTRACT_ADDRESS, 
      value: this.web3.utils.toWei(deposit, "ether")
    });
    console.log("result: ")
    console.log(result);

  }

  const handleWithdraw = async() => {
    let withdraw = await this.fomo.methods.withdrawMoney().send({
      from: this.accounts[0]
    })
      .then(console.log)
    console.log(withdraw);
      
  }


  const getContractBalance = async() => {
    let balanceResult = await this.fomo.methods.getBalance().call()
    setWithdraw(balanceResult);
    console.log("balanceResult");
    console.log(balanceResult);
  }

  const getUserKeyBalance = async() => {
    let getUserKeyBalanceResult = await this.fomo.methods.getUserKeyBalance().call()
    setUserKeyBalance(getUserKeyBalanceResult);
    console.log("getUserKeyBalanceResult");
    console.log(getUserKeyBalanceResult);
  }


  const getTotalKeyBalance = async() => {
    let getTotalKeyBalanceResult = await this.fomo.methods.getTotalKeyBalance().call()
    setTotalKeyBalance(getTotalKeyBalanceResult);
    console.log("getTotalKeyBalanceResult");
    console.log(getTotalKeyBalanceResult);
  }

  const getKeyPrice = async() => {
    let getKeyPriceResult = await this.fomo.methods.getKeyPrice().call()
    setKeyPrice(getKeyPriceResult);
    console.log("getKeyPriceResult");
    console.log(getKeyPriceResult);
  }


  const handleKeyAmountChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    console.log("event: ");
    console.log(event);
    setUserKeyPurchaseAmount(event.target.value);
  }

  const handlePurchaseKeys = async() => {
    console.log("userKeyPurchaseAmount:");
    console.log(userKeyPurchaseAmount);
    let amountToPay = userKeyPurchaseAmount*keyPrice;
    console.log("amountToPay:");
    console.log(amountToPay);
    let result = await this.fomo.methods.purchaseKeys(userKeyPurchaseAmount).send({
      from: this.accounts[0], 
      to: this.CONTRACT_ADDRESS, 
      value: amountToPay
    });
    console.log("handlePurchaseKeys result: ")
    console.log(result);

  }



  
  // render() {
  //   if (!loaded) {
  //     return <div>Loading Web3, accounts, and contract...</div>;
  //   }
    return (
      <div className="App">
        <Container fluid>
        <h1>FomoOE</h1>
        <h2></h2>
        <h2>Amount in Contract: {withdraw} wei</h2>
        <div className="d-grid gap-2">
        Amount to deposit: <input type="number" name="deposit" value={deposit} onChange={handleInputChange} />
        <Row className="mb-4">
          <Col>
            <Button variant="danger" size="lg" onClick={handleSubmit}>Deposit</Button>
          </Col>
          <Col>
            <Button variant="success" size="lg" onClick={handleWithdraw}>Withdraw</Button>
          </Col>
        </Row>
        </div>
        <div className="d-grid gap-2">
          <h2>Total Keys Bought: {totalKeyBalance}</h2>
          <h3>Current Key Price: {keyPrice}</h3>
          Amount of keys to buy: <input type="number" name="userKeyPurchaseAmount" value={userKeyPurchaseAmount} onChange={handleKeyAmountChange} />
          <Button variant="info" type="button" onClick={handlePurchaseKeys}>Buy Keys!!!</Button>{' '}
          <Alert >
              Keys owned: {userKeyBalance}
          </Alert>
        </div>
        </Container>
      </div>
    );
  
}

export default App;
