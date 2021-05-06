import React, { Component } from 'react'
import Footer from './Footer'
import Header from './Header'
import Mrc from './Mrc'


class PatientHome extends Component{
    

    constructor(props) {
        super(props)
        this.state = {
            account: localStorage.getItem('account'),
            hasError: false
        }
    }

    render(){
        return(
            <main>
                <Header account={this.state.account}/>
                <br/><br/><br/>
                <h4 style={{paddingLeft:"40px",color:"#ff9900"}}>Hello {this.state.account}</h4>
                <br/>
                <Mrc />
                <br/><br/>
                <Footer />
            </main>
        );
    }
}

export default PatientHome;