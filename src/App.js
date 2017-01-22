import React, { Component } from 'react'

import BillListContainer from 'components/BillList/BillListContainer'

class App extends Component {
  render () {
    return (
      <div className="App">
        <BillListContainer web3={this.props.web3} />
      </div>
    )
  }
}

export default App
