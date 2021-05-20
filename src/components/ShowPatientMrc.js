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
import Permissions from '../abis/Permissions.json'
import Encription from '../Encription'



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
          await this.loadingMrC()
          this.setState({ loading: false }) // show
        } else {
          window.alert('MrC contract not deployed to detected network.')
        }
      }
      async loadingMrC(){
        // get the mrc of this patient
        const mrc = await this.state.permissions.methods.getMrc(this.state.patientAccount)
        .call({from:this.state.account})
        this.setState({mrc})
    }

    constructor(props) {
        super(props)
        this.state = {
          loading: true,
            account: '',
            patientAccount: ''
        }
    }

    render(){
        return(
            <>
                <Error>
                {
                this.state.loading ? <div>Loading...</div> :
                <>
                <AddPrivateKey  parent ={this} />
                <Header account={this.state.account} />
                <div style={{padding:'40px'}}>
                <div><b id="mrcOf" style={{fontSize:"20px", paddingLeft:"20px" }}>MrC of {this.state.patientAccount}</b></div>
                <br/>
                <UploadEmr parent={this}/>
                </div>
              <Mrc  accountShow={this.patientAccount}   mrc= {this.state.mrc} accountKey={this.state.patientPrivateKey}/>
            <br></br>
            <Foother/>
            </>
            }
            </Error>
            </>
        );
    }
}

function AddPrivateKey(props) {
  const [show, setShow] = useState(true)
  const [privateKey, setPrivateKey] = useState("")
  
  const handleChange = (event) =>{
    setPrivateKey(event.target.value)
  }
  const handleSubmit = (event)=>{
    event.preventDefault()
    props.parent.setState({patientPrivateKey:privateKey})
    setShow(false)
  }
  return (
    <>
    <Modal show={show} onHide={() => null} >
        <Form onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>Add private key</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Control value={privateKey} onChange={handleChange} type="text" 
             placeholder="Enter private key of this patient" required pattern="[a-fA-F0-9]{64}$"
             onInvalid={(event) =>  event.target.setCustomValidity("Private key is incorrect!")}/>
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

function UploadEmr(props) {
    const [show, setShow] = useState(false)
    const [emrTypeValue, setEmrTypeValue] = useState("")
    const [keyType, setKeyType] = useState(0)
    const [keyStatus, setKeyStatus] = useState(0)
    const [prescriptions, setPrescriptions] = useState(false)
    const [emrStatusValue,setEmrStatusValue] = useState("VALID")
    const [file, setFile] = useState("")

    const handleShow = () => {
        setShow(true)
    }
    const handleSelectedEmrType = (event) => {
        const key = event.toString().split(",")[0]
        const value = event.toString().split(",")[1]
        setEmrTypeValue(value)
        setKeyType(key)
        if(parseInt(key) === 2){
            setPrescriptions(true)
        }
        else{
            setPrescriptions(false)
        }
    }
    const handleSelectedEmrStatus = (event) => {
      const key = event.toString().split(",")[0] 
      const value = event.toString().split(",")[1]
      setEmrStatusValue(value)
      setKeyStatus(key)
    }
    const validateFileType = (event) => {
        var fileName = event.target.value
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile!=="txt"){
            alert("Only txt file are allowed!");
            event.target.value = null
        }
        else{
          setFile(event.target.files[0])
        }
    }
    const handleSubmit = async (event) =>{
      event.preventDefault()
      setShow(false)
      const base64Data = await toBase64(file)
      const details = {
          typeEmr: parseInt(keyType),
          statuseEmr: parseInt(keyStatus),
          time: new Date().toLocaleString(),
          owner: props.parent.state.patientAccount,
          writer: props.parent.state.account,
          data: Encription.encrypt(base64Data,props.parent.state.patientPrivateKey) 
      }
      // save in blockaing!!
      props.parent.setState({ loading: true })
      await props.parent.state.permissions.methods.addEmr(details.owner,
            details.typeEmr,details.statuseEmr,details.time,
            details.data)
            .send({from: details.writer})
            .once('error', (error) => {
              props.parent.setState({ hasError: true })
              console.log(error)
            })
            .once('confirmation', (confirmation) => {
              props.parent.setState({ loading: false })
            })
    }
    return (
        <>
        <div style={{paddingLeft:"40px",color:"blue"}} onClick={handleShow}>
        <img src={IconUpload} width="50px" height="50px" className="d-inline-block align-top" alt="" />
          <b>Add a new EMR</b>
        </div>
        <Modal show={show} onHide={() => setShow(false)} >
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
                      <Form.Control id="emrFile" type="file" placeholder="Upload File" accept=".txt" onChange={validateFileType} />
                    </Form.Group>
            </Modal.Body>
            <Modal.Footer>
          <Button  type="button"  variant="submit" onClick={handleSubmit}>
            Add
          </Button>
        </Modal.Footer>
        </Modal>
        </>
    );
}

// convet file to base64
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export default ShowPatientMrc;