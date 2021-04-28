/** 
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22;
// ABIEncoderV2 is needed to return an array from a function. 
pragma experimental ABIEncoderV2;

contract Cetidicated{
    address ministryOfHealth;
    address ministryOfInterior;
    string messageToMinistryOfHealth; // service provider want to register to the network
    string messageToMinistryOfInterior; // patient want to register to the network
    address[] patients; // all the patient that registered
    ServiceProvider[] serviceProviders; // all the service provider that registered
  
 
  constructor(address _ministryOfHealth, address _ministryOfInterior)  {
    ministryOfInterior = _ministryOfInterior;
    ministryOfHealth = _ministryOfHealth;
  }

  enum PermissionType{
    READ,ALL,UPDATE
  }

  struct ServiceProvider{
    address serviceProviderAddress;
    PermissionType permissionType;
  }

    function getAddressMinistryOfHealth() public view returns (address){
    return ministryOfHealth;
  } 
  
  function getAddressMinistryOfInterior() public view returns (address){
    return ministryOfInterior;
  }

  //create event
  function patientPermission(address patient, uint id, string memory date) public {

  }

  function serviceProviderPermission(address servceProvider,string memory serviceProviderType, uint id, string memory date) public {
        
  }
 
  function getToPatientPermission(address patient) public {
    if(msg.sender == ministryOfInterior ){
      patients.push(patient);
      }
  }
 
  function getToServiceProviderPermission(ServiceProvider memory serviceProvider) public {
    if(msg.sender == ministryOfHealth ){
      serviceProviders.push(serviceProvider);
    }
  }
}
*/