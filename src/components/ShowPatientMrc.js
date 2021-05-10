import React, { Component } from 'react'
import Foother from './Footer'
import Header from './Header'
import Mrc from './Mrc'
import IconUpload from '../images/icon_upload.png'
import { Link} from "react-router-dom";
import Error from './Error'

class ShowPatientMrc extends Component{

    constructor(props) {
        super(props)
        this.state = {
            account: localStorage.getItem('account'),
            patientAccount: ''
        }
    }

    render(){
        return(
            <main>
                <Error>
                <Header account={this.state.account} />
                <div style={{padding:'40px'}}>
                <div><b id="mrcOf" style={{fontSize:"35px", paddingLeft:"20px" }}>MrC of {this.state.patientAccount}</b></div>
                    <br/>
                    <Link to={{ pathname: '/UploadEMR', state: { account: this.state.accout} }} >
                    <img src={IconUpload} width="50px" height="50px" class="d-inline-block align-top" alt="" />
                        <b>Add a new EMR</b>
                    </Link>
                </div>
              <Mrc />
            <br></br>
            <Foother/>
            </Error>
            </main>
        );
    }
}

export default ShowPatientMrc;