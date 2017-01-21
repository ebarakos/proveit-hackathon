
import React, { Component } from 'react'
import './BillList.css'

class BillList extends Component {
  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <td>Charger</td>
              <td>Chargee</td>
              <td>Amount</td>
              <td>End</td>
              <td>Accepted</td>
              <td>Paid</td>
              {
                this.props.incoming?[
                  <td key={0}>Accept</td>,
                  <td key={1}>Pay</td>
                ]:null
              }
            </tr>
          </thead>
          <tbody>
            {this.props.items.map(this.renderAccount.bind(this))}
          </tbody>
        </table>

      </div>
    )
  }

  renderAccount(item, index) {
    return <tr key={index}>
      <td>{item.charger}</td>
      <td>{item.chargee}</td>
      <td>{item.amount.valueOf()}</td>
      <td>{item.end.valueOf()}</td>
      <td>{item.accepted? 'YES': 'NO'}</td>
      <td>{item.paid? 'YES': 'NO'}</td>
      {
        this.props.incoming?[
          <td key={0}>
            <button onClick={function(){
              this.props.accept(item.address)
            }.bind(this)}>Accept</button>
          </td>,
          <td key={1}>
            <button onClick={function(){
              this.props.pay(item.address)
            }.bind(this)}>Pay</button>
          </td>
        ]:null
      }
    </tr>
  }
}

export default BillList
