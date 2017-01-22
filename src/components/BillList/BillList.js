
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
            <TableHeaderColumn><Span>Charger</Span></TableHeaderColumn>
              <TableHeaderColumn><Span>Chargee</Span></TableHeaderColumn>
              <TableHeaderColumn><Span>Amount</Span></TableHeaderColumn>
              <TableHeaderColumn><Span>End</Span></TableHeaderColumn>
              <TableHeaderColumn><Span>Expired</Span></TableHeaderColumn>
              <TableHeaderColumn><Span>Accepted</Span></TableHeaderColumn>
              <TableHeaderColumn><Span>Paid</Span></TableHeaderColumn>
              {
                this.props.incoming?[
                  <TableHeaderColumn key={0}><Span>Accept</Span></TableHeaderColumn>,
                  <TableHeaderColumn key={1}><Span>Pay</Span></TableHeaderColumn>
                ]:null
              }
          </TableRow>
        </TableHeader>
          
          <TableBody displayRowCheckbox={false} style={{fontSize:15}}>
     
            {this.props.items.map(this.renderAccount.bind(this))}
          </TableBody>
        </Table>

      </div>
    )
  }

  renderAccount(item, index) {
    return <TableRow key={index}>
      <TableRowColumn><Span>{item.charger}</Span></TableRowColumn>
      <TableRowColumn><Span>{item.chargee}</Span></TableRowColumn>
      <TableRowColumn><Span>{item.amount.valueOf()}</Span></TableRowColumn>
      <TableRowColumn><Span>{item.end.valueOf()}</Span></TableRowColumn>
      <TableRowColumn>{item.end.valueOf() > ((new Date()).valueOf() / 1000)? <Span color={'red'}>NO</Span>: <Span color={'green'}>YES</Span>}</TableRowColumn>
      <TableRowColumn>{item.accepted? <Span color={'green'}>YES</Span>: <Span color={'red'}>NO</Span>}</TableRowColumn>
      <TableRowColumn>{item.paid? <Span color={'green'}>YES</Span>:<Span color={'red'}>NO</Span>}</TableRowColumn>
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

class Span extends Component{
  render(){
    return <span style={{
      color:this.props.color||'black',
      fontSize:20
    }}>
    {
      this.props.children
    }
    </span>
  }
}

export default BillList
