import React, { Component  } from 'react'
import './ServiceProviderHome.css'
import { Redirect} from "react-router-dom";
import Header from './Header';
import Footer from './Footer'
import Error from './Error'

class ServiceProviderHome extends Component{


    constructor(props) {
        super(props)
        this.state = {
            account: localStorage.getItem('account'),
            permission:false,
            patientAccount: '',
            hasError: false
        }
        this.searchOnClick = this.searchOnClick.bind(this)
      }
      
    searchOnClick(){
        const search = document.getElementById('searchInput')
        // check if have permission 
        if(search !== undefined && search.value !== '' ){
            this.setState({ permission: true })
            this.setState({patientAccount: search.value})
        }
        else{
            this.setState({ permission: false })
            window.alert("Sorry you don't have permission!")
        }
        search.value = ''
        
    }
    render() {
        return(
            <main>
                <Error>
                <Header account={this.state.account}/>
                <br/><br/><br/>
                <h4 style={{paddingLeft:"40px",color:"#ff9900"}}>Hello {this.state.account}</h4>
           
              <div>
                  <h5 style={{textAlign: "center"}}>Searching patient by key</h5>
                  <div className="cover">
                      <div className="divFrom" >     
                          <input type="search" id="searchInput" />
                              <i className="fa fa-search"  
                              onClick={this.searchOnClick}></i>
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
              </main>
          );
      }
}
export default ServiceProviderHome;