import React, { Component } from 'react'
import './ServiceProviderHome.css'
import { Redirect} from "react-router-dom";
import Header from './Header';
import Footer from './Footer'
import Error from './Error'
import {loadState, saveToLocalStorage} from '../storage'
import {loadWeb3, loadBlockchainData} from '../loadBlockchain'
import $ from 'jquery'


class ServiceProviderHome extends Component{
  
  componentDidUpdate(){
    // user click back on browser from showPatient home, 
    // so he move to serviveProviderHome and can't comeback to showPatient page 
    window.onpopstate  = (e) => { 
      this.props.history.push('/ServiceProviderHome')
    }      
  }
  async componentDidMount() {
    // loading blockchain
    const blockchian = await loadWeb3()
    const blockchainData = await loadBlockchainData()
    if(blockchainData !== undefined ||blockchainData !== null || blockchian !== null){
      this.permissions = blockchain.permissions; // save smart contruct
      let state = await loadState();
      const newState = $.extend(this.state,state);
      this.setState(newState);
      state = $.extend(state, { patientAccount:'',patientPrivateKey:''});
      await saveToLocalStorage(state);
      this.setState({loading:false});

      // Authentication 
      if(this.state.serviceProvider === undefined || !this.state.serviceProvider){
        this.props.history.push('/');
      }
    }
    else{
      this.props.history.push('/');
    }
  }

  constructor(props) {
      super(props)
      this.state = {
        patientAccount:'',
        loading:true,
        searchValue:'0x',
        hasPermission:false,
        hasError: false
      }
     
      this.permissions = null
      this.searchPatient = this.searchPatient.bind(this)
      this.checkPermission = this.checkPermission.bind(this)
      this.changeSearchHandle = this.changeSearchHandle.bind(this)
  }
  // check permission on blockchain
  async checkPermission(account){
    if(account !== "" && account !== undefined){       
      const check  = await this.permissions.methods.havePermission(account)
      .call({from:this.state.account})
      return check 
    }
    return false;
  }
  // on click search
  async searchPatient(){
    const search = this.state.searchValue
    // check if have permission
    if(search !== undefined && search !== '' 
    && search.length === 42 && search.match('0x[a-fA-F0-9]{40}$')){
      
      this.setState({ loading: true }) 
      const check = await this.checkPermission(search)
      if(check){
        let state = await loadState() // get the old state
        state = $.extend(state,{patientAccount:search}) // add patientAccount to the state
        await saveToLocalStorage(state)
        this.setState({ loading: false })  
        this.setState({patientAccount:search,hasPermission:true}) // move to show pateint mrc
      }
      else{
        window.alert("Sorry! you don't have permission!!")
        this.setState({loading: false,patientAccount:'',hasPermission:false})
        this.setState({searchValue:'0x'}) 
      }
    }
    else{
      this.setState({loading: false,hasPermission: false })
      window.alert("Sorry! you entered incorrect account")
      this.setState({searchValue:'0x'}) 
    }
  }

  // value search change
  changeSearchHandle(event){
    this.setState({searchValue:event.target.value})
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
                          <input type="search" id="searchInput" value={this.state.searchValue} 
                          onChange={this.changeSearchHandle} minLength="42" maxLength="42" 
                          />
                              <i className="fa fa-search"  
                              onClick={this.searchPatient}
                              onTouchEnd={this.searchPatient} ></i>
                      </div>
                  </div>
                </div>
                  {this.state.hasPermission 
                  ?  
                  <Redirect push to={{
                    pathname: "/ShowPatientMrc"
                  }} />          
                  : null}
              <Footer/>
              </>
              }
              </Error>
              </>
          );
      }
}

export default ServiceProviderHome;
