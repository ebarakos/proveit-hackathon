
import React, { Component } from 'react'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';


class BillList extends Component {
  render() {
    return (
      <div>
      <Table
        selectable={false}>
        <TableHeader displaySelectAll={false} enableSelectAll={false}>
          <TableRow>
            <TableHeaderColumn>Charger</TableHeaderColumn>
              <TableHeaderColumn>Chargee</TableHeaderColumn>
              <TableHeaderColumn>Amount</TableHeaderColumn>
              <TableHeaderColumn>End</TableHeaderColumn>
              <TableHeaderColumn>Accepted</TableHeaderColumn>
              <TableHeaderColumn>Paid</TableHeaderColumn>
              {
                this.props.incoming?[
                  <TableHeaderColumn key={0}>Accept</TableHeaderColumn>,
                  <TableHeaderColumn key={1}>Pay</TableHeaderColumn>
                ]:null
              }
          </TableRow>
        </TableHeader>
          
          <TableBody displayRowCheckbox={false}>
     
            {this.props.items.map(this.renderAccount.bind(this))}
          </TableBody>
        </Table>

      </div>
    )
  }

  renderAccount(item, index) {
    return <TableRow key={index}>
      <TableRowColumn>{item.charger}</TableRowColumn>
      <TableRowColumn>{item.chargee}</TableRowColumn>
      <TableRowColumn>{item.amount.valueOf()}</TableRowColumn>
      <TableRowColumn>{item.end.valueOf()}</TableRowColumn>
      <TableRowColumn>{item.accepted? 'YES': 'NO'}</TableRowColumn>
      <TableRowColumn>{item.paid? 'YES': 'NO'}</TableRowColumn>
      {
        this.props.incoming?[
          <TableRowColumn key={0}>
            <RaisedButton onClick={function(){
              this.props.accept(item.address)
            }.bind(this)}>Accept</RaisedButton>
          </TableRowColumn>,
          <TableRowColumn key={1}>
            <RaisedButton onClick={function(){
              this.props.pay(item.address)
            }.bind(this)}>Pay</RaisedButton>
          </TableRowColumn>
        ]:null
      }
    </TableRow>
  }
}

export default BillList
