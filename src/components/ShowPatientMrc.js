import React, { Component, useState } from 'react'
import Foother from './Footer'
import Header from './Header'
import Mrc from './Mrc'
import IconUpload from '../images/icon_upload.png'
import IconExit from '../images/exit_icon.jpg'
import Error from './Error'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import './ShowPatientMrc.css'
import Encription from '../Encription'
import {loadState, saveToLocalStorage} from '../storage'
import {loadWeb3, loadBlockchainData,checkPrivateKeySuitableToAccount} from '../loadBlockchain'
import { Link} from "react-router-dom";
import $ from 'jquery'

class ShowPatientMrc extends Component {

  async componentDidMount() {
    // loading blockchain 
    const blockchian = await loadWeb3()
    const blockchainData = await loadBlockchainData()
    if(blockchainData !== undefined ||blockchainData !== null || blockchian !== null){
      this.permissions = blockchain.permissions; // save smart contruct
    }
    else{
      this.props.history.push('/');
    }

    const state = await loadState()
    this.setState(state);
    this.setState({showAddKey:true,loading:false});

    // Authentication 
    if(this.state.serviceProvider === undefined || !this.state.serviceProvider){
      this.props.history.push('/');
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      showAddKey: false,
      loading:true,
      showMrC:false,
      patientPrivateKey:''
    }
    this.permissions = null
  }

    async addPrivateKeyAndLoadingMrc(privateKey){
      this.setState({patientPrivateKey:privateKey})
      let state = await loadState()
      state = $.extend(state, {patientPrivateKey:privateKey})
      await saveToLocalStorage(state) // save to the storage
      // get the mrc of this patient
      await this.loadingMrc()
    }

    async loadingMrc(){
      this.setState({loading:true})
      const mrc = await this.permissions.methods.getMrc(this.state.patientAccount)
      .call({from:this.state.account})
      this.setState({mrc})
      this.setState({loading:false, showAddKey:false, showMrC:true})
    }

    async addEmr(details){
       // save in blockaing!!
       this.setState({ loading: true })
       await this.permissions.methods.addEmr(details.owner,
             details.typeEmr,details.statuseEmr,details.time,details.data)
             .send({from: details.writer})
             .once('error', (error) => {
               this.setState({ hasError: true })
               console.log(error)
             })
             .once('confirmation', (confirmation) => {
               this.setState({ loading: false })
               this.loadingMrc();
              })
    }

    render(){
        return(
            <>
                <Error>
                {this.state.loading ? <div>Loading...</div> :
                this.state.showAddKey ?<AddPrivateKey patientAccount={this.state.patientAccount} parent ={this} /> : 
                <>
                <Header parent={true} account={this.state.account} />
                <br/>
                <Link  to="/ServiceProviderHome">
                  <img src={IconExit} width="100px" height="60px" 
                  style={{paddingLeft:"40px", float:'right'}} alt=""/>
                </Link> 
                <div style={{padding:'40px'}}>
                <div><b id="mrcOf" style={{fontSize:"20px", paddingLeft:"20px" }}>MrC of {this.state.patientAccount}</b></div>
                <br/>
                <UploadEmr parent={this}/>
                </div>
                {
                  this.state.showMrC ? 
                  <Mrc  accountShow={this.state.patientAccount}  
                   mrc= {this.state.mrc} accountKey={this.state.patientPrivateKey}/> : null
                }
                
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
  const [show, setShow] = useState(props.parent.state.showAddKey);
  const [privateKey, setPrivateKey] = useState("");
  const [msgError, setMsgError] = useState('');
  
  const handleChange = (event) =>{
    setPrivateKey(event.target.value);
  }

  const handleSubmit = async (event)=>{
    event.preventDefault()

    if(privateKey !== undefined && privateKey !== '' && privateKey.length === 64
    && privateKey.match('^[A-Fa-f0-9]{64}$') && 
    checkPrivateKeySuitableToAccount(props.parent.state.patientAccount,privateKey)){
        setMsgError('')
        setShow(false)
        props.parent.addPrivateKeyAndLoadingMrc(privateKey)
    }
    else{
      setMsgError('Private key is incorrect')
    }
  }

  return (
    <>
    <Modal show={show} onHide={() => null} >
        <Form  method='GET' onSubmit={handleSubmit} id='formPrivateKey'>
        <Modal.Header>
          <Modal.Title style={{fontSize:'20px'}}>Add private key for<br/> {props.patientAccount}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label style={{fontSize:'15px', color:'red'}}>{msgError}</Form.Label>
            <Form.Control id='inputPrivateKey' value={privateKey} onChange={handleChange} type="password" 
             placeholder="Enter private key of this patient" required
             onInvalid={(event) =>  event.target.setCustomValidity("Private key is required")}/>
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
      props.parent.addEmr(details)
     
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
