const { assert } = require('chai')
const Permissions = artifacts.require('./Permissions.sol')
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Permissions', ([patient, serviceProvider, dev]) => {
  let permissions

  before(async () => {
    permissions = await Permissions.deployed()
  })
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await permissions.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('add serivce provider and new emr', async () => {
      let serviceProvidersBefore,serviceProvidersAfter, mrcPatient,mrcServiceProviderNot,mrcServiceProvider,
      serviceProvidersRevoke, beforeRemove,resultsAdd, resultsPermission, resultsRemovePermission
      
      before(async () => {    
        const time = new Date()
        
        //reject
        mrcServiceProviderNot = await permissions.getMrc(patient,{from:serviceProvider}).should.be.rejected
        await permissions.addEmr(patient,1,0,time.toISOString(), "testing",{from:serviceProvider}).should.be.rejected
        await permissions.addEmr(serviceProvider,1,0,time.toISOString(), "testing",{from:serviceProvider}).should.be.rejected
        

        serviceProvidersBefore = await permissions.getServiceProviderPermissions({ from: patient })
        resultsPermission = await permissions.giveAccessToServiceProvider(serviceProvider, { from: patient })
        serviceProvidersAfter = await permissions.getServiceProviderPermissions( { from: patient })
        resultsAdd = await permissions.addEmr(patient,1,0,time.toISOString(), "testing",{from:serviceProvider})
        mrcServiceProvider = await permissions.getMrc(patient,{from:serviceProvider})
        mrcPatient = await permissions.getMrc(patient,{from:patient})

        //remove persmission
        beforeRemove = await permissions.getServiceProviderPermissions({ from: patient })
        resultsRemovePermission = await permissions.revokeAccessFromDoctor(serviceProvider,{from: patient})
        serviceProvidersRevoke = await permissions.getServiceProviderPermissions({ from: patient })
      })

      it('add permission to service provider', async () => {
        const event = resultsPermission.logs[0].args
        assert.equal(serviceProvidersBefore.length,0, 'length permission before gave is courrect')
        assert.equal(serviceProvidersAfter.length,1, 'get permission is done')
        assert.equal(serviceProvidersAfter[0],serviceProvider,'permission courrect')
        assert.equal(event.owner, patient, "owner")
        assert.equal(event.serviceProvider, serviceProvider, "service provider")
        assert.equal(event.permission,true,"permission")
      })

      it('add emr', async()=>{
        const event = resultsAdd.logs[0].args 
        assert.equal(event.writer,serviceProvider,"service provider is courrect")
        assert.equal(event.typeEmr,1,"type Emr is courrect")
        assert.equal(event.statusEmr,0,"type Emr is courrect")
        assert.equal(event.data,"testing","type Emr is courrect")  
      })

      it('get emr - patient',async()=>{
          assert.equal(mrcPatient[0].writer,serviceProvider,"service provider is courrect")
          assert.equal(mrcPatient[0].typeEmr,1,"type Emr is courrect")
          assert.equal(mrcPatient[0].statusEmr,0,"type Emr is courrect")
          assert.equal(mrcPatient[0].data,"testing","type Emr is courrect")  
      })

      it('get emr - service provider permission',async()=>{
        assert.equal(mrcServiceProvider[0].writer,serviceProvider,"service provider is courrect")
        assert.equal(mrcServiceProvider[0].typeEmr,1,"type Emr is courrect")
        assert.equal(mrcServiceProvider[0].statusEmr,0,"type Emr is courrect")
        assert.equal(mrcServiceProvider[0].data,"testing","type Emr is courrect")  
      })
      
      it('remove service provider permission',async()=>{
        const event = resultsRemovePermission.logs[0].args
        assert.equal(event.owner, patient, "owner")
        assert.equal(event.serviceProvider, serviceProvider, "service provider")
        assert.equal(event.permission,false,"permission")
        assert.equal(beforeRemove.length,1,'before remove is good')
        assert.equal(serviceProvidersRevoke.length,0,'remove is done')
      })
  })
})