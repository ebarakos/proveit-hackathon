
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
            </tr>
          </thead>
          <tbody>
            {this.props.items.map(this.renderAccount)}
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
    </tr>
  }
}

export default BillList
