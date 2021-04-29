import React, { Component } from 'react'
import Foother from './Footer'
import Header from './Header'
import Mrc from './Mrc'

class ShowPatientMrc extends Component{

    constructor(props) {
        super(props)
    }

    render(){
        return(
            <main>
            <Header account={this.props.permisionAccount} />
              <Mrc />
            <br></br>
            <Foother/>
            </main>
        );
    }

    
}

export default ShowPatientMrc;