
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import TextField from 'material-ui/TextField'

import Paper from 'material-ui/Paper';

import RaisedButton from 'material-ui/RaisedButton';

class BillModal extends Component {
  handleSubmit(){
    this.props.successfullClose({
      chargee: this.chargee.input.value,
      amount: parseInt(this.amount.input.value) ,
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
          <TextField hintText="Chargee Account" type="text" ref={(input) => this.chargee = input} /> <br/>
          <TextField hintText="Amount in wei"  type="text" ref={(input) => this.amount = input} /><br/>
          <TextField hintText="End in seconds after now"  type="text" ref={(input) => this.end = input} /><br/>
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
