import React, { Component, useState } from 'react';
import './App.css';
import {Redirect} from "react-router-dom";
import Error from './Error';
import {loadState, saveToLocalStorage} from '../storage';
import {loadWeb3, loadBlockchainData,checkPrivateKeySuitableToAccount} from '../loadBlockchain';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Header from './Header';
import Footer from './Footer';

class App extends Component {
 
  async componentDidMount() {
    // loading blockchain 
    localStorage.clear()
    const blockchian = await loadWeb3()
    const blockchainData = await loadBlockchainData()
    if(blockchainData !== undefined ||blockchainData !== null || blockchian !== null){
      this.permissions = blockchain.permissions // save smart contruct
      const state = await loadState() 
      this.setState(state)
      this.setState({account:blockchain.account,loading:false})

    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      login: false, // show login if false
      serviceProvider: null, //serviceProvider= true login has service povider. flase = login has patient, null=no login 
      loading:true // upalod web3 
    }
    this.permissions = null;
  }

  async startLogin(details){
    const state = {
      account: this.state.account,
      privateKey:details.privateKey,
      login:true,
      serviceProvider:details.serviceProvider
    }
    await saveToLocalStorage(state);
    this.setState({login:true, serviceProvider:details.serviceProvider});
  }

  async checkSerivceProvider(account){
    const check  = await this.permissions.methods.hisServiceProvider()
      .call({from:account});
    return check;
  }

  render() {
    return (
    <>
      <Error>
        {this.state.loading ?<div>Loding.....</div> 
        :
          this.state.login ? 
          this.state.serviceProvider !== null && this.state.serviceProvider 
          ?  
          <Redirect push to={{
             pathname: "/ServiceProviderHome"
            }} />  
           : 
           <Redirect push to={{
              pathname: "/PatientHome"
            }} /> 
          :
          <>
          <Header />
          <br/><br/>
          <Login parent={this} />
          <br/><br/><br/>
          <Footer />
          </>
        }
      </Error>
    </>
    );
  }
}


function Login(props){
  const [privateKey,setPrivateKey] = useState('')
  const [account] = useState(props.parent.state.account)
  const [serviceProvider,setServiceProvider] = useState(false)
  const [msgError, setMsgError] = useState('')

  const handleChangePrivateKey = (event) =>{
    setPrivateKey(event.target.value)
  }
  const selectTypeToLogin = async (event) =>{
    if(event.target.id === 'serviceProviderLogin'){
      const check = await props.parent.checkSerivceProvider(account);
      if(check){
        setServiceProvider(true);
      }
      else{
        setMsgError("You not a service provider!!");
        setServiceProvider(false);
      }
    }
    else {
      setServiceProvider(false)
    }
  } 

  const handleSubmit = (event) => {
    event.preventDefault()

    if(privateKey !== '' && privateKey !== undefined
    && privateKey.length === 64 && privateKey.match('^[A-Fa-f0-9]{64}$') 
    && checkPrivateKeySuitableToAccount(account,privateKey)){
      const details = {
        account:account,
        privateKey:privateKey,
        serviceProvider: serviceProvider
      }
      setMsgError('')
      props.parent.startLogin(details)
    }
    else{
      setMsgError("Something is incorrect, please try again")
      setPrivateKey('')
      setServiceProvider(false)
    }
  }
  return (
    <div style={{paddingLeft:"30%", paddingRight:"30%"}}>
      <br/>
      <Form method='GET' onSubmit={handleSubmit}>
         <Form.Label style={{fontSize:'15px', color:'red'}}>{msgError}</Form.Label>
         <br/><br/>
         <Form.Control required id='inputPrivateKey' value={privateKey} 
            onChange={handleChangePrivateKey} type="password" placeholder="Enter private key" 
            onInvalid={(event) =>  event.target.setCustomValidity("Private key is required")}/>
         <br/>
         <Form.Label>Login as:</Form.Label><br/>
          <InputGroup className='mb-3' required style={{paddingLeft:"5%"}}>
           <InputGroup.Prepend>
             <InputGroup.Radio checked= {!serviceProvider} id="patientLogin" onClick={selectTypeToLogin} name="group1"/>
             <InputGroup.Text >A patient</InputGroup.Text>
            <InputGroup.Radio checked={serviceProvider} id="serviceProviderLogin" onClick={selectTypeToLogin} name="group1"/>
            <InputGroup.Text >A service provider</InputGroup.Text>
           </InputGroup.Prepend>
          </InputGroup> 
         <br/>
         <Button type='submit' variant='submit'>Sign in</Button>        
      </Form>
    </div>
  );
}
export default App;
