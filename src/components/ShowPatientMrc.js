import React, { Component, useState } from 'react'
import Foother from './Footer'
import Header from './Header'
import Mrc from './Mrc'
import IconUpload from '../images/icon_upload.png'
import Error from './Error'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import './ShowPatientMrc.css'
import Web3 from 'web3'


class ShowPatientMrc extends Component {

    async componentDidMount(){
        this.setState({account:localStorage.getItem('account'),
        patientAccount:localStorage.getItem('patientAccount') })
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
        const networkId = await web3.eth.net.getId()
        const networkData = Permissions.networks[networkId]
        if(networkData) {
          const permissions = web3.eth.Contract(Permissions.abi, networkData.address)
          this.setState({ permissions })
          this.setState({ loading: false })
        } else {
          window.alert('MrC contract not deployed to detected network.')
        }
      }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            loading: true,
            patientAccount: ''
        }
        this.addEmr = this.addEmr.bind(this)
    }

    async addEmr(details){
        this.setState({ loading: true })
        await this.state.permissions.methods.addEmr(this.state.patientAccount,
            details.typeEmr,details.statuseEmr,details.time,details.data)
            .send({from:this.state.account})
            .once('error', (error) => {
                this.setState({ hasError: true })
            })
            .once('confirmation', (confirmation) => {
                this.setState({ loading: false })
            })
    }

    render(){
        return(
            <main>
                <Error>
                {
                this.state.loading ? <div>Loading...</div> :
                <>
                <Header account={this.state.account} />
                <div style={{padding:'40px'}}>
                <div><b id="mrcOf" style={{fontSize:"20px", paddingLeft:"20px" }}>MrC of {this.state.patientAccount}</b></div>
                <br/>
                <UploadEmr addEmr={this.addEmr}/>
                </div>
              <Mrc accountShow={this.patientAccount}/>
            <br></br>
            <Foother/>
            </>
            }
            </Error>
            </main>
        );
    }
}


function UploadEmr(props) {
    const [show, setShow] = useState(false)
    const [emrTypeValue, setEmrTypeValue] = useState("")
    const [prescriptions, setPrescriptions] = useState(false)
    const [emrStatusValue,setEmrStatusValue] = useState("")

    const handleShow = () => {
        setShow(true)
    }
    const handleSelectedEmrType = (event) => {
        const number = event.toString().split(",")[0]
        const value = event.toString().split(",")[1]
        setEmrTypeValue(value)
        if(parseInt(number) === 2){
            setPrescriptions(true)
        }
        else{
            setPrescriptions(false)
        }
    }
    const handleSelectedEmrStatus = (event) => {
        const value = event.toString().split(",")[1]
        setEmrStatusValue(value)
    }
    const validateFileType = (event) => {
        var fileName = event.target.value
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile!=="pdf"){
            alert("Only pdf file are allowed!");
            event.target.value = null
        }   
    }
    const  handleSubmit = async () =>{
        const details = {

        }
        await props.addEmr(details)
    }

    return (
        <>
        <div style={{paddingLeft:"40px",color:"blue"}} onClick={handleShow}>
        <img src={IconUpload} width="50px" height="50px" className="d-inline-block align-top" alt="" />
          <b>Add a new EMR</b>
        </div>
        <Modal show={show} onHide={() => setShow(false)} >
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>Add a new EMR</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                  <Dropdown as={ButtonGroup} onSelect={handleSelectedEmrType} >
                    <Button variant="upEmrSelect">EMR type</Button>
                    <Dropdown.Toggle split variant="upEmrSelectItems" id="emrType"  />
                    <Dropdown.Menu >
                      <Dropdown.Item id="item0" eventKey="0,LABORATORY TEST RESULTS" >LABORATORY TEST RESULTS</Dropdown.Item>
                      <Dropdown.Item id="item1" eventKey="1,REFERENCES">REFERENCES</Dropdown.Item>
                      <Dropdown.Item id="item2"eventKey="2,MEDICATIONS AND PRESCRIPTIONS">MEDICATIONS AND PRESCRIPTIONS</Dropdown.Item>
                      <Dropdown.Item id="item3" eventKey="3,IMAGING TEST RESULTS">IMAGING TEST RESULTS</Dropdown.Item>
                      <Dropdown.Item id="item4" eventKey="4,YOUR DIAGNOSES">YOUR DIAGNOSES</Dropdown.Item>
                      <Dropdown.Item id="item5" eventKey="5,YOUR SENSITIVITY">YOUR SENSITIVITY</Dropdown.Item>
                      <Dropdown.Item id="item6" eventKey="6,THE VACCINES YOU DID">THE VACCINES YOU DID</Dropdown.Item>
                      <Dropdown.Item id="item7" eventKey="7,MEDICAL RECOMMENDATIONS" >MEDICAL RECOMMENDATIONS</Dropdown.Item>
                      <Dropdown.Item id="item8" eventKey="8,CERTIFICATES OF ILLNESS">CERTIFICATES OF ILLNESS</Dropdown.Item>
                      <Dropdown.Item id="item9" eventKey="9,MEDICAL INFORMATION SUMMARY">MEDICAL INFORMATION SUMMARY</Dropdown.Item>
                    </Dropdown.Menu>
                    <Form.Label  style={{color:'black', paddingLeft:"10px"}}>
                    {emrTypeValue}</Form.Label>
                    </Dropdown>
                    <br/><br/>
                    {
                    prescriptions 
                    ?
                    <Dropdown as={ButtonGroup} onSelect={handleSelectedEmrStatus} >
                    <Button variant="upEmrSelect">EMR status</Button>
                    <Dropdown.Toggle split variant="upEmrSelectItems" id="status"  />
                    <Dropdown.Menu >
                      <Dropdown.Item id="item0" eventKey="0,VALID" >VALID</Dropdown.Item>
                      <Dropdown.Item id="item1" eventKey="1,EXPIRED">EXPIRED</Dropdown.Item>
                      <Dropdown.Item id="item2"eventKey="2,BOUGHT">BOUGHT</Dropdown.Item>
                    </Dropdown.Menu>
                    <Form.Label  style={{color:'black', paddingLeft:"10px"}}>
                    {emrStatusValue}</Form.Label>
                    </Dropdown>
                    : null}
                    <Form.Group>
                      {prescriptions ? <br/> : null}
                    <Form.Label>Add file</Form.Label>
                      <Form.Control id="emrFile" type="file" placeholder="Upload File" accept=".pdf" onChange={validateFileType} />
                    </Form.Group>
            </Modal.Body>
            <Modal.Footer>
          <Button  type="submit"  variant="submit">
            Add
          </Button>
        </Modal.Footer>
        </Form>
        </Modal>
        </>
    );
}



export default ShowPatientMrc;