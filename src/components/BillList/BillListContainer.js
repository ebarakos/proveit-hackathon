import React, { Component } from 'react'
import BillList from './BillList.js'
import CreditContract from 'contracts/CreditContract.sol';
import Bill from 'contracts/Bill.sol';
import BillModal from './BillModal.js';

import Paper from 'material-ui/Paper';
import Web3 from 'web3';
import {Tabs, Tab} from 'material-ui/Tabs';


import FloatingActionButton from 'material-ui/FloatingActionButton';
import RefreshIcon from 'material-ui/svg-icons/action/autorenew';
import AddIcon from 'material-ui/svg-icons/content/add';


import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'
import Logo from './Black-Logo.png'


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
      this._getMyBalance(accs[0])
    }.bind(this))
  }

  _getMyBalance(account){
    this.props.web3.eth.getBalance.request(account, function(value){
      this.setState({balance: value.valueOf()})
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
        <img src={Logo} width={150}/>
        <div style={{marginTop:40, marginLeft:300, marginRight:300}}>
        <Paper zDepth={3} style={{left:'25%', textAlign:'center', padding:10}}>
          <h3>Account: {this.state.coinbase}</h3>
          <h3>Credit score: <span style={{color:'red'}}>{this.state.credit}</span></h3>
          <FloatingActionButton onClick={this._getAccountBills.bind(this)}>
            <RefreshIcon/>
          </FloatingActionButton>
          
        </Paper>
      </div>
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
          }>
          <h3>Check credit score</h3>
          <Paper zDepth={1} style={{textAlign:'center', padding:50}}>

            
            <TextField type="text" value="0xabd9053509b1509276d0737dab443f57f8ee9f08" ref={(input) => this.checkAccountInput = input} />
            <Paper zDepth={0} style={{margin:30}}>
              <span style={{color:'red'}}>
                { this.state.checkedCredit }
              </span>
            </Paper>
            <RaisedButton onClick={()=>{
              this._getCredit(this.checkAccountInput.input.value)
            }}>
              Check
            </RaisedButton>
            
          </Paper>
        </BillModal>

        <Paper zDepth={3} style={{marginLeft:20, marginRight:20, marginTop:'50px', padding:10}}>
          <Tabs>
            <Tab label="Outgoing bills" >
              <div>
                
                <BillList items={this.state.outgoing} />
                <FloatingActionButton onClick={()=>{this.setState({modalOpen:true})}}>
                  <AddIcon/>
                </FloatingActionButton>
              </div>
            </Tab>

            <Tab label="Incoming bills" >
              <div>
                <BillList items={this.state.ingoing}
                 incoming={true}
                 accept={this._acceptBill.bind(this)}
                 pay={this._payBill.bind(this)} />
              </div>
            </Tab>
          </Tabs>
        </Paper>
        

        
        
      </div>
    )
  }
}



export default BillsListContainer
