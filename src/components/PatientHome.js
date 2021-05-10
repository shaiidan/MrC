import React, { Component,useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Mrc from './Mrc'
import Error from './Error'
import Web3 from 'web3'
import Permissions from '../abis/Permissions.json'

class PatientHome extends Component{
    
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
      }
    
      async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
    
      async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        localStorage.setItem('account',this.state.account)
        const networkId = await web3.eth.net.getId()
        const networkData = Permissions.networks[networkId]
        if(networkData) {
          const permissions = web3.eth.Contract(Permissions.abi, networkData.address)
          this.setState({ permissions })
          localStorage.setItem('permissions',this.state.permissions)
          this.setState({ loading: false})
        } else {
          window.alert('MrC contract not deployed to detected network.')
        }
      }
   
    constructor(props) {
        super(props)
        this.state = {
            account: localStorage.getItem('account'),
            hasError: false,
            loading:true
        }
    }

    addAccessToServiceProvider(address){
        console.log(address)
    }

    

    render(){
        return(
            <>
            <Error > 
                {this.state.loading ? <div>Loading.....</div> 
                :
                <>               
                <Header account={this.state.account}/>
                <br/><br/><br/>
                <h4 style={{paddingLeft:"40px",color:"#ff9900"}}>Hello {this.state.account}</h4>
                <br/>
                <Mrc mrc= {this.state.mrc}/>
                <br/><br/>
                <div style={{paddingLeft:"40px"}}>
                    <h4>Access to service providers</h4><br/>
                    <AccessToServiceProvider onAddAccessToServiceProvider={this.addAccessToServiceProvider} />
                </div>
                <br/><br/>
                <Footer />
                </>
                }
            </Error>

            </>
        );
    }
}

function AccessToServiceProvider(props) {
  const [show, setShow] = useState(false)
  const [state,setState] = useState("")

  const handleClose = () =>{ 
      setShow(false)
      // check state
      if(state !== undefined && state !== ""){
          props.onAddAccessToServiceProvider(state)
          setState("")
      }
  }
  const handleShow = () => {
      setShow(true)
      setState("")
    }
  const handleChange = (event) =>{
      setState(event.target.value)
  }

  return (
    <>
      <Form.Label style={{color:"blue"}} onClick={handleShow}>
        Add a new access
      </Form.Label>
      <br/>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Label>Address</Form.Label>
            <Form.Control value={state} onChange={handleChange} type="text" placeholder="Enter address" required />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose} >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PatientHome;