import React, { Component } from 'react'
import './App.css'
import {Redirect} from "react-router-dom";
import Error from './Error'
import {saveToLocalStorage} from '../storage'
import {loadWeb3, loadBlockchainData} from '../loadBlockchain'

class App extends Component {
 
  async componentDidMount() {
    // loading blockchain 
    await loadWeb3()
    const blockchain = await loadBlockchainData()
    if(blockchain !== undefined ||blockchain !== null){
      this.permissions = blockchain.permissions // save smart contruct
      this.setState({account:blockchain.account,loading:false})
      saveToLocalStorage(this.state) // save state to storage
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      serviceProvider: true,
      loading:true
    }
    this.permissions = null;
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
             pathname: "/ServiceProviderHome"
            }} />  
          : 
            <Redirect push to={{
              pathname: "/PatientHome"
             }} /> 
      }
      </Error>
    </>
    );
  }
}

export default App;