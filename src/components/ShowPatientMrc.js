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
            account:'',
            patientAccount: ''
        }
        this.startLoading = this.startLoading.bind(this)
    }
    
    componentWillMount() {
        this.startLoading()
    }
    startLoading(){
        const {pathname} = this.props.location;
        if(pathname == '/ServiceProviderHome'){
            if(typeof this.props.location.state.account !== undefined &&
                typeof this.props.location.state.patientAccount !== undefined){
                    this.setState({patientAccount:this.props.location.state.patientAccount,
                        account:this.props.location.state.account})
                    }
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