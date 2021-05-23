import Web3 from 'web3'
import Permissions from './abis/Permissions.json'

export async function loadWeb3() {
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

export async function loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()
    const networkData = Permissions.networks[networkId]
    if(networkData) {
      const permissions = web3.eth.Contract(Permissions.abi, networkData.address)
      return {account:accounts[0], permissions:permissions}
    } else {
      window.alert('MrC contract not deployed to detected network.')
      return null
    }
  }
