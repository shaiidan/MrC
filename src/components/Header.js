import React, {Component} from 'react'
import { Link} from "react-router-dom";
import Web3 from "web3"
const logo_profile = require("../images/profile_icon.png")
const logo = require("../images/logo_with_title.png")

class Header extends Component{

    signOut(){
        if(this.props.account !== undefined){
            Web3.eth.accounts.wallet.remove(this.props.account);
            localStorage.clear();
        }
    }
    
    render(){
        return(
            <nav style={{borderBottom:"3px solid #7f7f7f"}}  className="navbar navbar-light" >
                {typeof this.props.parent === undefined  ? 
                <Link  to="/"><img src={logo} width="300px" height="120px" className="d-inline-block align-top" alt=""/>
                </Link> 
                :
                this.props.parent ?
                <Link  to="/ServiceProviderHome"><img src={logo} width="300px" height="120px" className="d-inline-block align-top" alt=""/>
                </Link> 
                : 
                <Link to="/PatientHome"><img src={logo} width="300px" height="120px" className="d-inline-block align-top" alt=""/>
                </Link>
                }
                {this.props.account !== undefined ?
                <div className="btn-group">
                    <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src={logo_profile}  width="35px" height="35px" className="d-inline-block align-top" alt="" /> 
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <div >Signed in as <b>{this.props.account}</b></div>
          
              <button className="dropdown-item" type="button" onClick={this.signOut}>Sign out</button>
            </div>
            </div>
            :null}
           </nav>
        );
    }
}

export default Header;