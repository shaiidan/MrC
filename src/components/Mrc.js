import React, { Component } from 'react'
import Error from './Error'
import Encription from '../Encription'

class Mrc extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      mrc: this.props.mrc,
      accountShow: this.props.accountShow,
      keyAccount: 'dd7d78dafbd161a73400b076af946b5cb61f0c6875ba0e3c75ff17ac518a29b1',
      hasError: false
    }
    this.filterMrc = this.filterMrc.bind(this)
  }
  async filterMrc(){
    const mrcFilter = {
      LABORATORY_TEST_RESULTS: [],
      REFERENCES: [],
      MEDICATIONS_AND_PRESCRIPTIONS: [],
      IMAGING_TEST_RESULTS:[],
      YOUR_DIAGNOSES: [],
      YOUR_SENSITIVITY: [],
      THE_VACCINES_YOU_DID: [],
      MEDICAL_RECOMMENDATIONS: [],
      CERTIFICATES_OF_ILLNESS:[],
      MEDICAL_INFORMATION_SUMMARY:[]
    }
    this.state.mrc.forEach(function (emr, index) {
      switch(emr.TypeEmr){
        case 0:{  mrcFilter.LABORATORY_TEST_RESULTS.push(emr); break; }
        case 1:{  mrcFilter.REFERENCES.push(emr); break; }
        case 2:{  mrcFilter.MEDICATIONS_AND_PRESCRIPTIONS.push(emr); break; }
        case 3:{  mrcFilter.IMAGING_TEST_RESULTS.push(emr); break; }
        case 4:{  mrcFilter.YOUR_DIAGNOSES.push(emr); break; }
        case 5:{  mrcFilter.YOUR_SENSITIVITY.push(emr); break; }
        case 6:{  mrcFilter.THE_VACCINES_YOU_DID.push(emr); break; }
        case 7:{  mrcFilter.MEDICAL_RECOMMENDATIONS.push(emr); break; }
        case 8:{  mrcFilter.CERTIFICATES_OF_ILLNESS.push(emr); break; }
        case 9:{  mrcFilter.MEDICAL_INFORMATION_SUMMARY.push(emr); break; }
        default:{}
      }
    });
    return mrcFilter
  }

  addRow(emr){
    const h = Encription.decrypt(emr.data,this.state.keyAccount)
    console.log(this.state.keyAccount)
    const fileName = "EMR-" + emr.time +".txt" 
    if(h === '' || h === undefined){
      return null;
    }
    return(
      <tr key={emr.emrId}>
      <td>{emr.time}</td>
      <td><a href={h} download={fileName}>Download</a></td>
    </tr>
    );
  }

    render(){
        return( 
        <>
        <Error>
          {this.state.mrc.length === 0 
          ? <div className="text-center" style={{color:"orange", fontSize: "30px"}} ><b>MrC is empty!</b></div>
          :
            <div className="row" style={{padding: "40px", paddingRight: "100px"}}>  
            <div className="col-3">
              <div style={{border: "#ff9900 solid 3px"}} className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical" >
            <a className="nav-link active" id="v-pills-laboratory-test-results-tab" data-toggle="pill" href="#v-pills-laboratory-test-results" role="tab" aria-controls="v-pills-laboratory-test-results" aria-selected="true">Laboratory test results</a>
            <a className="nav-link" id="v-pills-references-tab" data-toggle="pill" href="#v-pills-references" role="tab" aria-controls="v-pills-references" aria-selected="false">References</a>
            <a className="nav-link" id="v-pills-medications-and-prescriptions-tab" data-toggle="pill" href="#v-pills-medications-and-prescriptions" role="tab" aria-controls="v-pills-medications-and-prescriptions" aria-selected="false">Medications and prescriptions</a>
            <a className="nav-link" id="v-pills-imaging-test-results-tab" data-toggle="pill" href="#v-pills-imaging-test-results" role="tab" aria-controls="v-pills-imaging-test-results" aria-selected="false">Imaging test results</a>
            <a className="nav-link" id="v-pills-your-diagnoses-tab" data-toggle="pill" href="#v-your-diagnoses" role="tab" aria-controls="v-pills-your-diagnoses" aria-selected="false">Your diagnoses</a>
            <a className="nav-link" id="v-pills-your-sensitivity-tab" data-toggle="pill" href="#v-pills-your-sensitivity" role="tab" aria-controls="v-pills-your-sensitivity" aria-selected="false">Your sensitivity</a>
            <a className="nav-link" id="v-pills-vaccines-you-did-tab" data-toggle="pill" href="#v-pills-vaccines-you-did" role="tab" aria-controls="v-pills-vaccines-you-did" aria-selected="false">The vaccines you did</a>
            <a className="nav-link" id="v-pills-medical-recommendations-tab" data-toggle="pill" href="#v-pills-medical-recommendations" role="tab" aria-controls="v-pills-medical-recommendations" aria-selected="false">Medical recommendations</a>
            <a className="nav-link" id="v-pills-certificates-of-illness-tab" data-toggle="pill" href="#v-pills-certificates-of-illness" role="tab" aria-controls="v-pills-certificates-of-illness" aria-selected="false">Certificates of illness</a>
            <a className="nav-link" id="v-pills-medical-information-summary-tab" data-toggle="pill" href="#v-pills-medical-information-summary" role="tab" aria-controls="v-pills-medical-information-summary" aria-selected="false">Medical Information Summary</a>
        </div>
    </div>
    <div className="col-9">
        <div className="tab-content" id="v-pills-tabContent">
          <div  style={{width: "70%" ,paddingLeft: "40px"}} className="tab-pane fade show active" id="v-pills-laboratory-test-results" role="tabpanel" aria-labelledby="v-pills-v-pills-laboratory-test-results-tab">
        <table 
          id="table"
          className="table"
          data-toggle="table"
          data-flat="true"
          data-search="true">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Time</th>
                <th data-field="file" >File</th>
              </tr>
            </thead>
            <tbody>
              {this.state.mrc.map(emr=>{
                return(this.addRow(emr));
              })}
            </tbody>
            </table>
          </div>
          
          <div style={{width: "70%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-references" role="tabpanel" aria-labelledby="v-pills-references-tab">
          <table 
          id="table"
          data-toggle="table"
          data-toolbar=".toolbar">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Date</th>
                <th data-field="file" >File</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
            </table> 
          </div>
          <div style={{width: "70%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-medications-and-prescriptions" role="tabpanel" aria-labelledby="v-pills-medications-and-prescriptions-tab">
          <table 
          id="table"
          data-toggle="table"
          data-toolbar=".toolbar">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Date</th>
                <th data-field="file" >File</th>
                <th data-field="status">Status</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
            </table>
        </div>
          <div style={{width: "70%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-imaging-test-results" role="tabpanel" aria-labelledby="v-pills-imaging-test-results-tab">
          <table 
          id="table"
          data-toggle="table"
          data-toolbar=".toolbar">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Date</th>
                <th data-field="file" >File</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
            </table>
          </div>
          <div style={{width: "70%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-your-diagnoses" role="tabpanel" aria-labelledby="v-pills-your-diagnoses-tab">
          <table 
          id="table"
          data-toggle="table"
          data-toolbar=".toolbar">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Date</th>
                <th data-field="file" >File</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
            </table>
          </div>
          <div style={{width: "70%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-your-sensitivity" role="tabpanel" aria-labelledby="v-pills-your-sensitivity-tab">
          <table 
          id="table"
          data-toggle="table"
          data-toolbar=".toolbar">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Date</th>
                <th data-field="file" >File</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
            </table>
          
          </div>
          <div style={{width: "70%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-vaccines-you-did" role="tabpanel" aria-labelledby="v-pills-vaccines-you-did-tab">

          <table 
          id="table"
          data-toggle="table"
          data-toolbar=".toolbar">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Date</th>
                <th data-field="file" >File</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
            </table>          
          </div>
          <div style={{width: "70%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-medical-recommendations" role="tabpanel" aria-labelledby="v-pills-medical-recommendations-tab">
          <table 
          id="table"
          data-toggle="table"
          data-toolbar=".toolbar">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Date</th>
                <th data-field="file" >File</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
            </table>
          </div>
          <div style={{width: "70%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-certificates-of-illness" role="tabpanel" aria-labelledby="v-pills-certificates-of-illness-tab">
          <table 
          id="table"
          data-toggle="table"
          data-toolbar=".toolbar">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Date</th>
                <th data-field="file" >File</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
            </table>
          
          </div>
          <div style={{width: "70%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-medical-information-summary" role="tabpanel" aria-labelledby="v-pills-medical-information-summary-tab">
          <table 
          id="table"
          data-toggle="table"
          data-toolbar=".toolbar">
            <thead>
              <tr>
                <th data-field="date"  data-sortable="true" >Date</th>
                <th data-field="file" >File</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
            </table>
            </div>
        </div>
    </div>
</div>
}
<br/><br/>
            </Error>
            </>
        );
    }
}
export default Mrc;