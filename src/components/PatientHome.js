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
import deleteIcon from '../images/delete_icon.jpg'

class PatientHome extends Component{
    
    async componentDidMount() {
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
          await this.loadingMrC()
          this.setState({ loading: false})
        } else {
          window.alert('MrC contract not deployed to detected network.')
        }
      }
      
      async loadingMrC(){
          // get all service providers have permission
          const accessList = await this.state.permissions.methods.getServiceProviderPermissions().call({"from":this.state.account})
          this.setState({accessList})
          // get the mrc of this patient
          const mrc = await this.state.permissions.methods.getMrc(this.state.account).call({from:this.state.account})
          this.setState({mrc})
      }
   
    constructor(props) {
        super(props)
        this.state = {
            account: localStorage.getItem('account'),
            hasError: false,
            loading:true
        }
        this.removeAccess = this.removeAccess.bind(this)
        this.loadingMrC = this.loadingMrC.bind(this)
    }

    async addAccessToServiceProvider(backToComponent,address){
        backToComponent.setState({ loading: true })
        backToComponent.state.permissions.methods.giveAccessToServiceProvider(address)
        .send({from:backToComponent.state.account})
        .once('error', (error) => {
            backToComponent.setState({ hasError: true })
        })
        .once('confirmation', (confirmation) => {
            backToComponent.loadingMrC() // update mrc
            backToComponent.setState({ loading: false })
        })   
    }

    async removeAccess(address){
        // revoke this address
        this.setState({ loading: true })
        this.state.permissions.methods.revokeAccessFromDoctor(address)
        .send({from:this.state.account,gas:0})
        .once('error', (error) => {
            this.setState({ hasError: true })
        })
        .once('confirmation', (confirmation) => {
            this.loadingMrC() // update mrc
            this.setState({ loading: false })
        })
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
                <Mrc accountShow={this.state.account} mrc= {this.state.mrc} accountKey= {this.state.privateKey}/>
                <br/><br/>
                <div style={{paddingLeft:"40px"}}>
                    <h4>Access to service providers</h4>
                    <AccessToServiceProvider backToComponent={this} onAddAccessToServiceProvider={this.addAccessToServiceProvider} />
                    <br/>
                {
                    this.state.accessList.map(access =>{
                        return (<b key={access}>{access.toString()}<span>    </span> 
                              <img src={deleteIcon} width="20px" height="20px"  onClick={() => this.removeAccess(access)} alt=""/></b>) 
                    })
                }
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

  const handleShow = () => {
      setShow(true)
      setState("")
  }
  const handleSubmit = () =>{
      setShow(false)
      // check state
      if(state !== undefined && state !== ""){
        props.onAddAccessToServiceProvider(props.backToComponent,state)
        setState("")
    }
  }
  const handleChange = (event) =>{
      setState(event.target.value)
  }

  return (
    <>
      <span style={{color:"blue"}} onClick={handleShow}>
        Add a new access
      </span>
      <br/>
      <Modal show={show} onHide={() => setShow(false)} >
        <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Control value={state} onChange={handleChange} type="text" 
             placeholder="Enter address" required pattern="0x[a-fA-F0-9]{40}$"
             onInvalid={(event) =>  event.target.setCustomValidity("Accout address is incorrect!")}/>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit"  variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default PatientHome;