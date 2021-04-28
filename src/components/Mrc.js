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
    

    // start the mrc 
    renderStart(){
        if(this.state.hasError){
            return <div id="error" className="text-center" style={{color: "red"}} ><p className="text-center">Something wrong happend...</p></div>
        }
        else{
            return <div><b id="hello" style={{fontSize:"20px", paddingLeft:"20px" }}>Hello {this.props.account}</b></div>
        }

    }
    render(){
        
        return( 
            <main>
            {this.renderStart()}
            {this.state.mrc.length == 0 
            ? <div className="text-center" style={{color:"orange", fontSize: "40px"}} ><b>Your MrC is empty!</b></div>
            :<div></div>}
            </main>
        );
    }
}
export default Mrc;