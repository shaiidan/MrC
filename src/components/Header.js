import React, {Component} from 'react'
const logo_profile = require("../images/profile_icon.png")
const logo = require("../images/logo_with_title.png")
class Header extends Component{

    constructor(props) {
        super(props)
    }
    
    render(){
        return(
            <nav  class="navbar navbar-light" >
                <a href="javascript:windows.location.reload(true)"><img src={logo} width="300px" height="120px" class="d-inline-block align-top" alt=""/></a>
                {typeof this.props.account !== undefined ?
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src={logo_profile}  width="35px" height="35px" class="d-inline-block align-top" alt="" /> 
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <div >Signed in as <b>{this.props.account}</b></div>
          
              <button class="dropdown-item" type="button">Your profile</button>
              <button class="dropdown-item" type="button">Sign out</button>
            </div>
            </div>
            :null}
           </nav>
        );
    }
}

export default Header;