import React, { Component } from 'react'
import BillList from './BillList.js'
import CreditContract from 'contracts/CreditContract.sol';
import Bill from 'contracts/Bill.sol';
import BillModal from './BillModal.js';
import Web3 from 'web3';

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
CreditContract.setProvider(provider);
Bill.setProvider(provider);

class BillsListContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      coinbase: '',
      modalOpen:false,
      credit:0,
      ingoing: [],
      outgoing:[]
    }

  }

  _getBills(account){
    let creditContract = CreditContract.deployed();
    
    creditContract.outgoingBillsCount(account).then(function(count){
      let outgoing = [];
      for (let i=0; i<count; i++){
        outgoing.push(creditContract.outgoingBills(account, i));
        Promise.all(outgoing).then(function(results){
          Promise.all(results.map(
            
            this._getBillData
           
          )).then(function(bills){
            this.setState({outgoing:bills.map(
              this._billListToObject
            )})
          }.bind(this))
        }.bind(this)) 
      }
    }.bind(this))

    creditContract.billsCount(account).then(function(count){
      let ingoing = [];
      for (let i=0; i<count ;i++){
        ingoing.push(creditContract.bills(account, i));
        Promise.all(ingoing).then(function(results){
          Promise.all(results.map(
            function(address){
              return this._getBillData(address).then(this._billListToObject)
            }.bind(this)
          )).then(function(bills){
            console.log(bills)
            this.setState({ingoing:bills})
          }.bind(this))
        }.bind(this)) 
      }
    }.bind(this))

  }


  _getBillData(address){
    let bill = Bill.at(address);
    let billPromises = [
      bill.charger(),
      bill.chargee(),
      bill.amount(),
      bill.end(),
      bill.accepted(),
      bill.paid(),
      address
    ];

    return Promise.all(billPromises)
  }

  _billListToObject(billList){
    return {
      charger: billList[0],
      chargee: billList[1],
      amount: billList[2],
      end: billList[3],
      accepted: billList[4],
      paid: billList[5],
      address: billList[6],
      checkedCredit: 0
    }
  }

  _getCredit(account){
    let creditContract = CreditContract.deployed();
    creditContract.credits(account).then(function(credit){
      this.setState({checkedCredit:credit.valueOf()})
    }.bind(this));
  }

  _getMyCredit(account){
    let creditContract = CreditContract.deployed();
    creditContract.credits(account).then(function(credit){
      console.log(credit)
      this.setState({credit:credit.valueOf()})
    }.bind(this));
  
  }

  _getAccountBills () {
    this.props.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        window.alert('There was an error fetching your accounts.')
        console.error(err)
        return
      }

      if (accs.length === 0) {
        window.alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      this.setState({coinbase: accs[0]})
      this._getBills(accs[0])
      this._getMyCredit(accs[0])

    }.bind(this))
  }

  _newBill(bill){
    let creditContract = CreditContract.deployed();
    creditContract.AddBill(bill.chargee, bill.amount, bill.end,  {from: this.state.coinbase, gas: 1000000 }).then(function(){});
    this._getAccountBills()
  }

  _acceptBill(address){
    let bill = Bill.at(address);
    bill.Accept({from: this.state.coinbase}).then(function(){})
    this._getAccountBills()
  }

  _payBill(address){
    let bill = Bill.at(address);
    bill.amount().then(function(amount){

      bill.Pay({from:this.state.coinbase, value:amount.valueOf(), gas:3000000})
      this._getAccountBills()
    }.bind(this))
 
  }

  componentDidMount() {
    this._getAccountBills()

  }

  render() {
    return (
      <div>
        <h1>Account: {this.state.coinbase}</h1>
        <h1>Credit: {this.state.credit}</h1>
        <button
          onClick={this._getAccountBills.bind(this)}
        > Refresh</button>
        <BillModal 
          isOpen={this.state.modalOpen}
          unsuccessfullClose={
            ()=>{
              this.setState({modalOpen: false})
            }
          }
          successfullClose={
            (bill)=>{
              this._newBill(bill)
              this.setState({modalOpen:false})
            }
          }/>
        <div style={{borderWidth:1, borderColor:'black', border:'solid'}}>
          <h1>Outgoing bills</h1>
          <BillList items={this.state.outgoing} />
          <button onClick={()=>{this.setState({modalOpen:true})}}>New</button>
        </div>
        <div style={{borderWidth:1, borderColor:'black',  border:'solid'}}>
          <h1>Incoming bills</h1>
          <BillList items={this.state.ingoing}
           incoming={true}
           accept={this._acceptBill.bind(this)}
           pay={this._payBill.bind(this)} />
        </div>

        <div style={{borderWidth:1, borderColor:'black', border:'solid'}}>
          <h1>Check credit</h1>
          <input type="text" ref={(input) => this.checkAccountInput = input} />
          { this.state.checkedCredit }
          <button onClick={()=>{
            this._getCredit(this.checkAccountInput.value)
          }}>Check</button>
        </div>
        
      </div>
    )
  }
}



export default BillsListContainer
