import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import Permission from '../abis/Permissions.json'
import {Redirect} from "react-router-dom";
import Foother from './Footer'
import Header from './Header'
import Error from './Error'


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    localStorage.setItem('account',this.state.account)
    const networkId = await web3.eth.net.getId()
    const networkData = Permission.networks[networkId]
    if(networkData) {
      const permission = web3.eth.Contract(Permission.abi, networkData.address)
      this.setState({ permission })
    } else {
      window.alert('MrC contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      loading: false,
      serviceProvider: false
    }
  }

  render() {

    return (
     
    <main>
      <Error>
      {
        <main>
          <Header />
          <br/><br/>
          {this.state.account == '' ?null : 
          this.state.serviceProvider 
          ?  
           <Redirect push to={{
             pathname: "/ServiceProviderHome",
             state: { account: this.state.account }
            }} />  
            : 
            <Redirect push to={{
              pathname: "/PatientHome",
              state: { account: this.state.account }
             }} /> 
            }
            <br/><br/>
            <Foother />
            </main>
      }
      </Error>
    </main>
    );
  }
}

export default App;