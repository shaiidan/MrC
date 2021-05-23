import React, { Component,useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Mrc from './Mrc'
import Error from './Error'
import deleteIcon from '../images/delete_icon.jpg'
import { loadState,saveToLocalStorage } from '../storage'
import {loadWeb3, loadBlockchainData} from '../loadBlockchain'

class PatientHome extends Component{
  
  async componentDidMount() {
    // loading blockchain 
    this.setState({loading:true})
    await loadWeb3()
    const blockchain = await loadBlockchainData()
    if(blockchain !== undefined ||blockchain !== null){
      this.permissions = blockchain.permissions // save smart contruct
      await this.loadingMrC()
    }
  }
  
  async loadingMrC(){
    // get all service providers have permission
    const accessList = await this.permissions.methods.getServiceProviderPermissions().call({"from":this.state.account})
    this.setState({accessList})
    saveToLocalStorage(this.state) // save to storage
    // get the mrc of this patient
    const mrc = await this.permissions.methods.getMrc(this.state.account).call({from:this.state.account})
    this.setState({mrc})
    this.setState({loading:false})
    saveToLocalStorage(this.state) //save to storage
  }
   
    constructor(props) {
        super(props)
        this.state = loadState()
        this.permissions = null
        this.removeAccess = this.removeAccess.bind(this)
        this.loadingMrC = this.loadingMrC.bind(this)
    }

    async addAccessToServiceProvider(backToComponent,address){
        backToComponent.setState({ loading: true })
        backToComponent.permissions.methods.giveAccessToServiceProvider(address)
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
        this.permissions.methods.revokeAccessFromDoctor(address)
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