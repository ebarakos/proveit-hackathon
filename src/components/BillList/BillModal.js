
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import TextField from 'material-ui/TextField'

import Paper from 'material-ui/Paper';

import RaisedButton from 'material-ui/RaisedButton';

class BillModal extends Component {
  handleSubmit(){
    this.props.successfullClose({
      chargee: this.chargee.input.value,
      amount: parseInt(this.amount.input.value) * 1000000000000000000 ,
      end: parseInt(this.end.input.value) + (new Date()).valueOf() / 1000
    })
  }


  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.unsuccessfullClose}
        shouldCloseOnOverlayClick={false}
        contentLabel="New Bill"
        style={{content:{padding:'50px'}}}>



        <div style={{marginLeft:300, marginRight:300}}>

          <h4>New Bill</h4>
          <Paper zDepth={1} style={{textAlign:'center', padding:50,display:'inline-block', width:'100%'}}>
          <span style={{marginRight:20, fontWeight:'bold'}}>Account</span><TextField hintText="Chargee Account" type="text" ref={(input) => this.chargee = input} value="0xabd9053509b1509276d0737dab443f57f8ee9f08" /> <br/>
          <span style={{marginRight:20, fontWeight:'bold'}}>Amount</span><TextField hintText="Amount in ether"  type="text" ref={(input) => this.amount = input} value="1" /><br/>
          <span style={{marginRight:20, fontWeight:'bold'}}>Expiry time</span><TextField hintText="End in seconds after now"  type="text" ref={(input) => this.end = input} value="120" /><br/>
          <RaisedButton onClick={this.handleSubmit.bind(this)}>Submit</RaisedButton>
          </Paper>
        </div>

        <div style={{marginLeft:300, marginRight:300}}>
        {
          this.props.children
        }
        </div>
      </ReactModal>
    )
  }

}

export default BillModal
