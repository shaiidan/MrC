import React, { Component } from 'react'
import './ServiceProviderHome.css'
import { Redirect} from "react-router-dom";
import Header from './Header';
import Footer from './Footer'
import Error from './Error'
import Modal from 'react-bootstrap/Modal'
import {saveToLocalStorage} from '../storage'
import {loadWeb3, loadBlockchainData} from '../loadBlockchain'

class ServiceProviderHome extends Component{
  
  async componentDidUpdate(){
    window.onpopstate  = (e) => { 
      this.props.history.push('/')
    }      
}
  async componentDidMount() {
       // loading blockchain
       await loadWeb3()
       const blockchain = await loadBlockchainData()
       if(blockchain !== undefined ||blockchain !== null){
         this.permissions = blockchain.permissions // save smart contruct
         this.setState({loading:false,account:blockchain.account,patientAccount:''})
         await saveToLocalStorage(this.state)
    }
  }
  constructor(props) {
      super(props)
      this.state = {
        loading:true,
        hasPermission:false,
        loadingPatient: false,
        hasError: false
      }
     
      this.permissions = null
      this.searchPatient = this.searchPatient.bind(this)
      this.checkPermission = this.checkPermission.bind(this)
  }
  async checkPermission(account){
    if(account !== "" && account !== undefined){       
      this.setState({ loading: true }) 
      const check  = await this.permissions.methods.havePermission(account)
      .call({from:this.state.account})
      if(check){
        this.setState({patientAccount:account,loadingPatient:false,hasPermission:true})
        await saveToLocalStorage(this.state)
      }
      else{
        window.alert("Sorry! you don't have permission!!")
        this.setState({patientAccount:''})
        await saveToLocalStorage(this.state)  
      }
    }
    else{
      window.alert("Sorry! something wrong happened")
    }
    this.setState({ loading: false }) // loading finish
    //await saveToLocalStorage(this.state)  // save state to storage
}
      
    async searchPatient(){
      const search = document.getElementById('searchInput')
      // check if have permission
      if(search !== undefined && search.value !== '' ){
        this.setState({loadingPatient:true})  // show loading 
        await this.checkPermission(search.value)
      }
      else{
        this.setState({ permission: false })
        //await saveToLocalStorage(this.state)  // save state to storage
        window.alert("Sorry! you entered incorrect account")
      }
        search.value = ''
    }

    render() {
        return(
            <>
                <Error>
                {this.state.loading ? <div>Loading.....</div> :
                <>
                <Header parent={true} account={this.state.account}/>
                <br/><br/><br/>
                <h4 style={{paddingLeft:"40px",color:"#ff9900"}}>Hello {this.state.account}</h4>
                <br/><br/>
              <div>
                  <h5 style={{textAlign: "center"}}>Searching patient by address</h5>
                  <div className="cover">
                      <div className="divFrom" >     
                          <input type="search" id="searchInput" />
                              <i className="fa fa-search"  
                              onClick={async () => {await this.searchPatient()}} onTouchEnd={async () => {await this.searchPatient()}} ></i>
                      </div>
                  </div>
                  <Modal show={this.state.loadingPatient}  onHide={() => null}>
                    <Modal.Header >
                      <Modal.Title>Loading..</Modal.Title>
                      </Modal.Header>
                      <Modal.Body><span>Please wait...</span></Modal.Body>
                  </Modal>
                  {this.state.hasPermission 
                  ?  
                  <Redirect push to={{
                    pathname: "/ShowPatientMrc"
                  }} />          
                  : null}
              </div>
              <Footer/>
              </>
              }
              </Error>
              </>
          );
      }
}

export default ServiceProviderHome;