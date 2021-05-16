import React, { Component  } from 'react'
import './ServiceProviderHome.css'
import { Redirect} from "react-router-dom";
import Header from './Header';
import Footer from './Footer'
import Error from './Error'
import Web3 from 'web3'
import Permissions from '../abis/Permissions.json'


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
    } else {
      window.alert('MrC contract not deployed to detected network.')
    }
  }

    constructor(props) {
        super(props)
        this.state = {
            account: localStorage.getItem('account'),
            hasPermission:false,
            patientAccount: '',
            hasError: false
        }
        this.searchOnClick = this.searchOnClick.bind(this)
        this.checkPermission = this.checkPermission.bind(this)
      }
    
    async checkPermission(){
        if(this.state.patientAccount !== "" && this.state.patientAccount !== undefined){         
            if(Web3.utils.isAddress(this.state.patientAccount)){
                const check  = await this.state.permissions.methods.havePermission(this.state.patientAccount).call({from:this.state.account})
                if(check){
                    this.setState({hasPermission:true})
                }
                else{
                    window.alert("Sorry! you don't have permission!!")
                }
            }
            else{
                window.alert("Please enter illegal address!")
            }
        }
    }
      
    async searchOnClick(){
        const search = document.getElementById('searchInput')
        // check if have permission 
        if(search !== undefined && search.value !== '' ){
            this.setState({patientAccount: search.value})
            await this.checkPermission()
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
                              onClick={this.searchOnClick} onTouchEnd={this.searchOnClick} ></i>
                      </div>
                  </div>
                  {this.state.permission 
                  ?  
                  <Redirect push to={{
                    pathname: "/ShowPatientMrc",
                    state: { patientAccount: this.state.patientAccount,
                    account: this.state.account }
                  }} />          
                  : null}
              </div>
              <Footer/>
              </Error>
              </>
          );
      }
}
export default ServiceProviderHome;