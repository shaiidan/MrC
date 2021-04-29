import React, { Component } from 'react'
import './ServiceProviderHome.css'
import { BrowserRouter as Router, Switch, Route,Redirect} from "react-router-dom";
import Mrc from './Mrc'
class ServiceProviderHome extends Component{
    
    constructor(props) {
        super(props)
        this.state = {
            permission:false,
            hasError: false
        }
        this.searchOnClick = this.searchOnClick.bind(this)
      }
    
    searchOnClick(){
        const search = document.getElementById('searchInput')
        if(search !== undefined && search.value !== '' && search.value != '666'){
            this.setState({ permission: true })
            this.setState({permissionAccount: search.value})
        }
        else{
            this.setState({ permission: false })
        }
        search.value = ''
        
    }
    render() {
        return(
              <div>
                  <h5 style={{textAlign: "center"}}>Searching patient by key</h5>
                  <div class="cover">
                      <div className="divFrom" >     
                          <input type="search" id="searchInput" />
                              <i class="fa fa-search"  
                              onClick={this.searchOnClick}></i>
                      </div>
                  </div>
                  {this.state.permission 
                  ?  
                  <Router>
                   <Switch>   
                    <Route path="/showPatientMrc">
                        <br></br>
                      <Mrc account={this.state.permissionAccount} />
                    </Route>
                    <Redirect to="/showPatientMrc" push="true"/>
                  </Switch>
                  </Router>
                  
                  : null}
              </div>
          );
      }
}
export default ServiceProviderHome;