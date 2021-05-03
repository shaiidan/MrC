import React, { Component } from 'react'
import Error from './Error'

class Mrc extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mrc: [],
            hasError: false
        }
      }

    render(){
        
        return( 
            <main>
                <Error>
            {this.state.mrc.length == 0 
            ? <div className="text-center" style={{color:"orange", fontSize: "40px"}} ><b>Your MrC is empty!</b></div>
            :<div></div>}
            </Error>
            </main>
        );
    }
}
export default Mrc;