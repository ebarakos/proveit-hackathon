
import React, { Component } from 'react'
import ReactModal from 'react-modal'

class BillModal extends Component {
  handleSubmit(){
    this.props.successfullClose({
      chargee: this.chargee.value,
      amount: parseInt(this.amount.value),
      end: parseInt(this.end.value)
    })
  }


  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.unsuccessfullClose}
        shouldCloseOnOverlayClick={false}
        contentLabel="New Bill">

        <h1>New Bill</h1>
        Chargee
        <input type="text" ref={(input) => this.chargee = input} /> <br/>
        Amount
        <input type="text" ref={(input) => this.amount = input} /><br/>
        End
        <input type="text" ref={(input) => this.end = input} /><br/>
        <button onClick={this.handleSubmit.bind(this)}>Submit</button>
      </ReactModal>
    )
  }

}

export default BillModal
