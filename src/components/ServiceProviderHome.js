import React, { Component} from 'react'
import './ServiceProviderHome.css'
import { Redirect} from "react-router-dom";
import Header from './Header';
import Footer from './Footer'
import Error from './Error'
import Web3 from 'web3'
import Permissions from '../abis/Permissions.json'
import Modal from 'react-bootstrap/Modal'

class ServiceProviderHome extends Component{
    
  async componentDidMount() {
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
    const networkId = await web3.eth.net.getId()
    const networkData = Permissions.networks[networkId]
    if(networkData) {
      const permissions = web3.eth.Contract(Permissions.abi, networkData.address)
      this.setState({ permissions })
      this.setState({ loading: false })
    } else {
      window.alert('MrC contract not deployed to detected network.')
    }
  }

    constructor(props) {
        super(props)
        this.state = {
            account: localStorage.getItem('account'),
            loading:true,
            hasPermission:false,
            patientAccount: '',
            loadingPatient: false,
            hasError: false
        }
        this.searchPatient = this.searchPatient.bind(this)
        this.checkPermission = this.checkPermission.bind(this)
      }
    
    async checkPermission(account){
      if(account !== "" && account !== undefined){       
        this.setState({ loading: true }) 
        const check  = await this.state.permissions.methods.havePermission(account).call({from:this.state.account})
        this.setState({loadingPatient:false})
        if(check){
          this.setState({hasPermission:true})
          localStorage.setItem('patientAccount',account)
          this.setState({patientAccount:localStorage.getItem('patientAccount')})
        }
        else{
          window.alert("Sorry! you don't have permission!!")
          this.setState({patientAccount:''})
        }
      }
      else{
        window.alert("Sorry! something wrong happened")
      }
      this.setState({ loading: false }) // loading finish
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
                <Header account={this.state.account}/>
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