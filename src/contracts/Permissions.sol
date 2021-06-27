//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;
//ABIEncoderV2 is needed to return an array from a function. is Experimental!! 
pragma experimental ABIEncoderV2;

contract Permissions {

  enum TypeEmr{
    LABORATORY_TEST_RESULTS,
    REFERENCES,
    MEDICATIONS_AND_PRESCRIPTIONS,
    IMAGING_TEST_RESULTS,
    YOUR_DIAGNOSES,
    YOUR_SENSITIVITY,
    THE_VACCINES_YOU_DID,
    MEDICAL_RECOMMENDATIONS,
    CERTIFICATES_OF_ILLNESS,
    MEDICAL_INFORMATION_SUMMARY
  }

  enum StatusEmr {
    VALID, EXPIRED, BOUGHT
  }

  struct EMR {
    uint emrId;
    address writer;
    address owner;  
    TypeEmr typeEmr; 
    StatusEmr statusEmr;
    string time;
    string data;
  }

  event EmrAdded(
    uint emrId,
    address writer,
    address owner, 
    TypeEmr typeEmr, 
    StatusEmr statusEmr,
    string time,
    string data
  );

   event ServiceProviderPermissionCall(
    address owner,
    address serviceProvider,
    bool permission
  );


  /* Every user has a list of EMRs. */
  mapping (address => EMR[]) private emrs;

   /**
   * A user can specify, which service providers are allowed to view their medical records.
   * Access is granted, when the user adds his address to service Providers list of patients.
   * As soon as the user address is removed from the list, access for the service provider is revoked.
   * mapping: patientAddress -> ServiceProviderAddresses
   */
  mapping (address => address[]) private serviceProvidersPermissions;

  /**
   * Add a medical record.
   * Returns true if add or false if not.
   */
  function addEmr(address owner, TypeEmr typeEmr, StatusEmr statuseEmr, string memory time, string memory data) public {
    address writer = msg.sender;

    // check if owner != writer 
    require(writer != owner,'You can not add to yourself');
    // check if service provider as a permission 
    bool serviceProviderPermission = false;

    for(uint i=0; i<serviceProvidersPermissions[owner].length; i++){
      if(serviceProvidersPermissions[owner][i] == writer){
        serviceProviderPermission = true;
      }
    }
    require(serviceProviderPermission,'Permission needed');
    emrs[owner].push(EMR(emrs[owner].length +1,msg.sender, owner, typeEmr, statuseEmr, time, data));
    //trigger 
    emit EmrAdded(emrs[owner].length +1,msg.sender, owner, typeEmr, statuseEmr, time, data); // call the event
  }
 
  /**
   * Get all medical records of a user.
   */
  function getMrc(address user) public view returns (EMR[] memory) {
    address from = msg.sender;
    bool serviceProviderPermission = false;

    for(uint i=0; i<serviceProvidersPermissions[user].length; i++){
      if(serviceProvidersPermissions[user][i] == from){
        serviceProviderPermission = true;
      }
    }
    // get MrC of the user, if owner is the ask or the ask get permission from the owner
    require(from == user || serviceProviderPermission, "You needed permission");
    return emrs[user];
  }

  /**
   * Allow a service provider to view all your documents.
   */
  function giveAccessToServiceProvider(address serviceProvider) public {
    bool serviceProviderPermissionExist = false;
    address from = msg.sender;

    require(serviceProvider != from,'you can not add yourself');
    
    for(uint i=0; i<serviceProvidersPermissions[from].length; i++){
      if(serviceProvidersPermissions[from][i] == from){
        serviceProviderPermissionExist = true;
      }
    }
    require(!serviceProviderPermissionExist,'service provider has permission already');
    serviceProvidersPermissions[from].push(serviceProvider);
    emit ServiceProviderPermissionCall(from,serviceProvider,true); //call event
  }

  /**
   * Revoke a service provider access to your documents.
   */
  function revokeAccessFromDoctor(address serviceProvider) public {
    address from = msg.sender; 
    int indexRemove = -1;
    for(uint i; i<serviceProvidersPermissions[from].length; i++){
      if(serviceProvider == serviceProvidersPermissions[from][i]){
        indexRemove = int(i);
      }
    }

    require(indexRemove != -1, 'This service provider not have permission already');

    address[] memory arrayNew = new address[](serviceProvidersPermissions[from].length-1);
    for (uint i = 0; i<arrayNew.length; i++){
      if(i != uint(indexRemove) && i< uint(indexRemove)){
        arrayNew[i] = serviceProvidersPermissions[from][i];
      }
      else {
        arrayNew[i] = serviceProvidersPermissions[from][i+1];
      }
    }
    delete serviceProvidersPermissions[from];
    serviceProvidersPermissions[from] = arrayNew;
    emit ServiceProviderPermissionCall(from,serviceProvider,false); //call event
  }

  /**
   * Returns all the service provider addresses that the patient gave access.
   */
  function getServiceProviderPermissions() public view returns (address[] memory) {
    return serviceProvidersPermissions[msg.sender];
  }

  /**
   * Check if serive provider has permission.
   */
  function havePermission(address patient) public view returns(bool){
    
    bool hasPermission = false;
    for(uint i; i< serviceProvidersPermissions[patient].length;i++){
      if(msg.sender == serviceProvidersPermissions[patient][i]){
        hasPermission = true;
      }
    }
    
    return hasPermission;
  }

  /**
   * Returns all the service provider addresses that the patient gave access.
   */
   function hisServiceProvider() public view returns(bool){

     address s = msg.sender;

     if(s == 0xbdAd07B27DA31E92AE1C4AD9353563658ed4BF00){
       return true;
     }
     else if(s == 0x70dd15C82Ec01a955aB2e72e32C1813Ac700Fe22){
       return true;
     }
     return false;
   }
} // end of contruct 