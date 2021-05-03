import React from 'react';
import {BrowserRouter as Router , Route} from 'react-router-dom';
import App from './components/App';
import ServiceProviderHome from './components/ServiceProviderHome'
import UploadEmr from './components/UploadEmr'
import ShowPatientMrc from './components/ShowPatientMrc'
import Error from './components/Error'
import PatientHome from './components/PatientHome'

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
    <Router>
        <Route exact path="/" component={App} />
        <Route path="/Error" component={Error} />
        <Route path='PatientHome' component={PatientHome}/>
        <Route path="/ServiceProviderHome" component={ServiceProviderHome}/>
        <Route path="/UploadEmr" component={UploadEmr}/>   
        <Route path="/ShowPatientMrc" component={ShowPatientMrc}/>
        
    </Router>
);