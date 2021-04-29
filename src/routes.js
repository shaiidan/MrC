const routes = require('next-routes')(); // the require returns a function. the second () is for invoking.

// Define a new route mapping
// arguments: the pattern to look for, which route inside the page directory we want to display.
routes
    .add('/', '/index')
    .add('/patientHome', '/patientHome')
    .add('/serviceProviderHome', '/serviceProviderHome')
    .add('/showPatientMrC', '/showPatientMrC')
    .add('/uploadEmr', '/uploadEmr');
    
module.exports = routes;