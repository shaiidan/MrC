import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import Permissions from '../abis/Permissions.json'
import {Redirect} from "react-router-dom";
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
    const networkData = Permissions.networks[networkId]
    if(networkData) {
      const permissions = web3.eth.Contract(Permissions.abi, networkData.address)
      this.setState({ permissions })
      localStorage.setItem('permissions',this.state.permissions)
      this.setState({ loading: false})
    } else {
      window.alert('MrC contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      serviceProvider: false,
      loading:true
    }
  }

  render() {

    return (
    <>
      <Error>
        {this.state.loading ?null 
        :
          this.state.account === '' ?<div><h4>Loading......</h4></div> :
          
          this.state.serviceProvider 
          ?  
           <Redirect push to={{
             pathname: "/ServiceProviderHome",
             state: {}
            }} />  
          : 
            <Redirect push to={{
              pathname: "/PatientHome",
              state: {}
             }} /> 
      }
      </Error>
    </>
    );
  }
}

export default App;