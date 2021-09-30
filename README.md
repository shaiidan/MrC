# MrC
Medical-records Chain
Simulation of a research project, 
creation of a complete medical history based on blockchain, the simulation that allows the creation of a network in Ethereum and the Frontend in React.

### Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any  problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* Go-Ethereum - [Download & Install Geth](https://geth.ethereum.org/downloads/).
* MetaMask - [Download & Install MetaMask for your browser](https://metamask.io/download) for Chrome browser.
* Ganache - [Download & Install Ganache](https://www.trufflesuite.com/ganache)


### Downloading MrC Simulation boilerplate

There are several ways you can get the MrC Simulation:

### Cloning The GitHub Repository
The recommended way to get MrC is to use git to directly clone the MrC repository:

```bash
$ git clone https://github.com/shaiidan/MrC.git
```

This will clone the latest version of the MrC repository to a **MrC** folder.

### Downloading The Repository Zip File
Another way to use the MrC Simulation is to download a zip copy from the [main branch on GitHub](https://github.com/shaiidan/MrC/archive/refs/heads/main.zip). You can also do this using the `wget` command:

```bash
$ wget https://github.com/shaiidan/MrC/archive/refs/heads/main.zip -O mrc.zip; unzip mrc.zip; rm mrc.zip
```

## Quick Install

Once you've downloaded the boilerplate and installed all the prerequisites, you're just a few steps away from upload the site - 
The boilerplate comes pre-bundled with a `package.json` files that contain the list of modules you need to start your application.

To install the dependencies, run this in the application folder from the command-line:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* When the npm packages install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application

## Running Your Network

There are 2 ways to run the network:
Test Network - Using Ganache,

"Live" Network - via Geth,
To run the first node we will run the following command -

'''bash
$ cd network
$ geth --datadir node1/ --miner.gasprice '0' --mine --unlock '0x26474347e1c57Fcc59F10675E196ba46a101205c' --password node1/password.txt --syncmode 'full' --port 40310 --http --http.port 8501 --http.addr '0.0.0.0' --http.vhosts "*"   --http.api 'admin,debug,web3,eth,txpool,personal,clique,miner,net' --ipcdisable --nodiscover --networkid 1405 --allow-insecure-unlock  --verbosity 3 --light.serve 1000
'''
To know how to run the rest of the nodes go into the project enter the file:

'''bash
& cd MrC/network/.configNetwork/run_nodes.txt
'''
And each node contains run=(we will copy it to bash)

## Running MetaMask

Add account that you want to run to MetaMask 
Using the private key written in the path
If not registered, you can import the key file located in each of the nodes' folders
For example for node 1 we will import the file in path -

'''bash
& cd MrC/network/node1/keystore/UTC - 2021-09-13T05-27-02.739754700Z - 26474347e1c57fcc59f10675e196ba46a101205
'''

* If you using in test network on Ganache, add acounts from there. 


## Running Your Application

Run your application using npm:

```bash
$ npm start
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.


## Running the tests

Run test application using npm:

```bash
$ npm test
```


### Technologies

* bootstrap
* Javascript
* React
* Web3
* Ethereum Blockchain

## Authors
* **Shai Idan** - [ShaiIdan](https://github.com/shaiidan)
* **Harel Jerbi** - [HarelJerbi](https://github.com/harel159)



