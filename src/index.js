import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Web3 from 'web3'
import injectTapEventPlugin from 'react-tap-event-plugin';
import './index.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


import truffleConfig from '../truffle.js'

var web3Location = `http://${truffleConfig.rpc.host}:${truffleConfig.rpc.port}`

window.addEventListener('load', function() {                    
  var web3Provided;

  injectTapEventPlugin();

  // Supports Metamask and Mist, and other wallets that provide 'web3'.      
  if (typeof web3 !== 'undefined') {                            
    // Use the Mist/wallet provider.     
    // eslint-disable-next-line                       
    web3Provided = new Web3(web3.currentProvider);               
  } else {                                                      
    web3Provided = new Web3(new Web3.providers.HttpProvider(web3Location))
  }   

  ReactDOM.render(

  <MuiThemeProvider>
    <App web3={web3Provided} />
     </MuiThemeProvider>,
    document.getElementById('root')
  )                                                                                                                    
});

