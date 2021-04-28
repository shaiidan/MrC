import React, { Component } from 'react'

class Mrc extends Component{

    async componentWillMount() {
        await this.checkAccount()
    }

    async checkAccount(){
        if(this.props.account === undefined ){
            window.alert('You need courrect account!')
            this.state.hasError = true;
        }
    }

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
            {
                this.state.hasError
                ?<div id="error" className="text-center" style={{color: "red"}} ><p className="text-center">Something wrong happend...</p></div>
                : <div><b id="hello" style={{fontSize:"20px", paddingLeft:"20px" }}>Hello {this.props.account}</b></div>
            }
            </main>
        );
    }
}

export default Mrc;