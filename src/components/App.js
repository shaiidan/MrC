import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import Permission from '../abis/Permissions.json'
import { BrowserRouter as Router, Route} from "react-router-dom"
import Foother from './Footer'
import Header from './Header'
import Mrc from './Mrc'


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
    const networkId = await web3.eth.net.getId()
    const networkData = Permission.networks[networkId]
    if(networkData) {
      const permission = web3.eth.Contract(Permission.abi, networkData.address)
      this.setState({ permission })
      this.setState({ loading: false})
    } else {
      window.alert('MrC contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      loading: true
    }
  }

  render() {

    return (
    <main>
      {
        this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">You need to login...</p></div>
                : <mean>
                  <Header account={this.state.account} />
                    <Mrc account={this.state.account} />
                    <br/><br/><br/><br/>
                  <Foother />
                  </mean>
      }
    </main>
    );
  }
}

export default App;