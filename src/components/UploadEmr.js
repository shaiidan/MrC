import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import './UploadEmr.css'

class UploadEmr extends Component {

  constructor(props) {
    super(props)
    this.state = {
        permission:false,
        hasError: false,
        account: localStorage.getItem('account'),
        emrTypeValue: '',
        emrStatusValue: ' ',
        prescriptions:false // for service provider is pharmacist
    }

    this.handleSelectedEmrType = this.handleSelectedEmrType.bind(this)
    this.handleSelectedEmrStatus = this.handleSelectedEmrStatus.bind(this)
  }
  handleSubmit(event) {

      //event.preventDefault();
  }
  handleSelectedEmrType(event){
      const number = event.toString().split(",")[0]
      const value = event.toString().split(",")[1]
      this.setState({emrTypeValue: value})
      if(number ===2){
        this.setState({prescriptions:true})
      }
      else{
        this.setState({prescriptions:false})
      }
   
    }
    handleSelectedEmrStatus(event){
      //const number = event.toString().split(",")[0]
      const value = event.toString().split(",")[1]
      this.setState({emrStatusValue: value})
    }
    validateFileType(event){
      var fileName = event.target.value
      var idxDot = fileName.lastIndexOf(".") + 1;
      var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      if (extFile==="pdf"){
          
      }else{
          alert("Only pdf file are allowed!");
          event.target.value = null
      }   
  }

    render() {

        return (
          <main>
            <Header account = {this.state.account} />
              <div className="divForm">
                <h2 className="text-center">Add a new EMR</h2><br/>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formID">
                  <Form.Label>Address</Form.Label>
                  <Form.Control id="emrId"type="text" placeholder="Enter ID" required/>
                  </Form.Group>
                  <Dropdown as={ButtonGroup} onSelect={this.handleSelectedEmrType} >
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
                    {this.state.emrTypeValue}</Form.Label>
                    </Dropdown>
                    <br/><br/>
                    {
                    this.state.prescriptions 
                    ?
                    <Dropdown as={ButtonGroup} onSelect={this.handleSelectedEmrStatus} >
                    <Button variant="upEmrSelect">EMR status</Button>
                    <Dropdown.Toggle split variant="upEmrSelectItems" id="status"  />
                    <Dropdown.Menu >
                      <Dropdown.Item id="item0" eventKey="0,VALID" >VALID</Dropdown.Item>
                      <Dropdown.Item id="item1" eventKey="1,EXPIRED">EXPIRED</Dropdown.Item>
                      <Dropdown.Item id="item2"eventKey="2,BOUGHT">BOUGHT</Dropdown.Item>
                    </Dropdown.Menu>
                    <Form.Label  style={{color:'black', paddingLeft:"10px"}}>
                    {this.state.emrStatusValue}</Form.Label>
                    </Dropdown>
                    : null}
                    <Form.Group>
                      {this.state.prescriptions ? <br/> : null}
                    <Form.Label>Add file</Form.Label>
                      <Form.Control id="emrFile" type="file" placeholder="Upload File" accept=".pdf" onChange={this.validateFileType} />
                    </Form.Group>
                    <br/>
                    <Button id="btnAdd" variant="upEmr" type="submit"> Add
                    </Button>
                    </Form>

              </div>
              <br/><br/>
            <Footer/>            
          </main>
        );
    }
}
export default UploadEmr;