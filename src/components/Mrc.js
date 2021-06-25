import React, { Component } from 'react';
import Error from './Error';
import Encription from '../Encription';
import { Redirect } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import './Mrc.css'

class Mrc extends Component {

  componentDidMount() {
    if( this.state.mrc === undefined || this.state.accountKey === undefined 
      || this.state.accountShow === undefined){
        this.setState({hasError:true})
        // go to error!!
      }
  }
  constructor(props) {
    super(props)
    this.state = {
      mrc: this.props.mrc,
      accountShow: this.props.accountShow,
      accountKey: this.props.accountKey,
     // keyAccount: 'dd7d78dafbd161a73400b076af946b5cb61f0c6875ba0e3c75ff17ac518a29b1',
      hasError: false
    }  
  }

  // get columns bt type
  getColumns(type){
    let columns;
    columns = [
      {
        dataField: "time",
        text: "Time",
        sort: true 
      },
      {
        dataField: "file",
        text: "File",
      }
    ];
    if(type === 2){
      columns.push({
        dataField: "status",
        text: "Status",
        sort: true })
    }
    return columns;
  }

  //conver status number to status string
  statusToString(status){
    if(status === 0){
      return 'VALID';
    }
    else if(status === 1){
      return 'EXPIRED';
    }
    else if(status === 2){
      return 'BOUGHT'
    }
  }

  // get emrs by type
  getEmrs(type){
    let emrs =[];
    
    this.state.mrc.map(emr=>{
      if(emr.typeEmr === type){
        const h = Encription.decrypt(emr.data,this.state.accountKey)
        const fileName = "EMR-" + emr.time +".txt" 
        if(h !== '' && h !== undefined && h !== null && type !== 2){
          emrs.push(
            {
              time: emr.time,
              file: <a href={h} download={fileName}>Download</a>
            });
        }
        else if(h !== '' && h !== undefined && h !== null && type === 2){
          emrs.push(
            {
              time: emr.time,
              file: <a href={h} download={fileName}>Download</a>,
              status: this.statusToString(emr.statusEmr)
            });
        }
      } 
      return null;
    });  
    return emrs;
  }
  
    render(){
        return( 
        <>
        <Error>
          {this.state.hasError ? <Redirect to="/Error" /> :
          this.state.mrc === null || this.state.mrc.length === 0 
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
       
          {/* table of type == 0 */}
          <div  style={{width: "90%" ,paddingLeft: "40px"}} className="tab-pane fade show active" id="v-pills-laboratory-test-results" role="tabpanel" aria-labelledby="v-pills-v-pills-laboratory-test-results-tab">
            <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(0)}
            columns={this.getColumns(0)}
            />
          </div>   
          
          {/* table of type == 1 */}
          <div style={{width: "90%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-references" role="tabpanel" aria-labelledby="v-pills-references-tab">
          <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(1)}
            columns={this.getColumns(1)}
            />
          </div>
          
          {/* table of type == 2 */}
          <div style={{width: "90%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-medications-and-prescriptions" role="tabpanel" aria-labelledby="v-pills-medications-and-prescriptions-tab">
          <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(2)}
            columns={this.getColumns(2)}
            />
          </div>
          {/* table of type == 3 */}
          <div style={{width: "90%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-imaging-test-results" role="tabpanel" aria-labelledby="v-pills-imaging-test-results-tab">
          <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(3)}
            columns={this.getColumns(3)}
            />          
          </div>
          {/* table of type == 4 */}
          <div style={{width: "90%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-your-diagnoses" role="tabpanel" aria-labelledby="v-pills-your-diagnoses-tab">
          <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(4)}
            columns={this.getColumns(4)}
            />

          </div>
          {/* table of type == 5 */}
          <div style={{width: "90%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-your-sensitivity" role="tabpanel" aria-labelledby="v-pills-your-sensitivity-tab">
          <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(5)}
            columns={this.getColumns(5)}
            />
          </div>

          {/* table of type == 6 */}
          <div style={{width: "90%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-vaccines-you-did" role="tabpanel" aria-labelledby="v-pills-vaccines-you-did-tab">
            <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(6)}
            columns={this.getColumns(6)}
            />          
          </div>

          {/* table of type == 7 */}
          <div style={{width: "90%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-medical-recommendations" role="tabpanel" aria-labelledby="v-pills-medical-recommendations-tab">
        <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(7)}
            columns={this.getColumns(7)}
            />          
          </div>

          {/* table of type == 8 */}
          <div style={{width: "90%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-certificates-of-illness" role="tabpanel" aria-labelledby="v-pills-certificates-of-illness-tab">
          <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(8)}
            columns={this.getColumns(8)}
            />       
          </div>

          {/* table of type == 9 */}
          <div style={{width: "90%" ,paddingLeft: "40px"}}  className="tab-pane fade" id="v-pills-medical-information-summary" role="tabpanel" aria-labelledby="v-pills-medical-information-summary-tab">
          <BootstrapTable
            bootstrap4
            keyField="time"
            data={this.getEmrs(9)}
            columns={this.getColumns(9)}
            />  
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
}// end class Mrc
export default Mrc;