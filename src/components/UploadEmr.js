import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'

class UploadEmr extends Component{

  componentWillMount() {
    if(typeof this.props.location.state.account !== undefined){
      this.setState({account:this.props.location.state.account})
    }
  }

    constructor(props) {
        super(props)
        this.state = {
            permission:false,
            hasError: false,
            mgs: '',
            account: ''
        }
      }

    handleSubmit(event) {

      //event.preventDefault();
    }

    render() {

        return (
          <div>
          <Header account = {this.state.account} />
        <div class="jumbotron centered" id="jumbo">
            <div class="container mt-5" >
                <h2 className="text-center">Add a new EMR</h2>
                <br></br>
                <div class="row justify-content-center">
                    <div class="col-sm-8">
                        <div class="card">
                            <div class="card-body">
                                <div class="alert alert-bg-light" role="alert">
                                    {typeof this.state.mgs != undefined ? this.state.mgs : null}
                                </div>
                  <form onSubmit={this.handleSubmit}>
                  <div class="form-group" >
                    <label for="id">ID</label>
                    <input type="text" class="form-control" name="id" id="id"  required pattern="^[0-9]+$" title="ID can only contains numbers" />
                  </div>
                  
                  <div class="form-group">
                      <label for="EMRFile" class="form-label">Upload file</label>
                      <input class="form-control form-control-lg" id="EMRFile" name ="EMRFile" type="file" accept="application/pdf"/>
                  </div>
                  <div class="form-group">
                    <button type="submit" name="add" value="add" id="addButton" class="btn btn-block btn-dark">Add
                    </button>
                  </div>
                  </form>
                <br/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
        );
    }
}
export default UploadEmr;