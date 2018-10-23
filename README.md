# RateMyHack
This repo holds the code for the Sample Application RateMyHack, used in one of our Microsoft Azure modules.

## Installing

To install all the dependencies, run the following command:

`npm install`

## Configuring the Application

The application uses the following environment variables:

```
ETHER_URL= # Ethereum Node URL
ACCOUNT_ADDRESS= # Account Address
ACCOUNT_PASSWORD= # Account Password
CONTRACT_ADDRESS= # Contract Address
```

## The Contract

The contract source can be found in the `contracts` folder.

## Running the Application

To start the application, run the following:

`node index.js`

The application will be accessible via http://localhost:3000/

Note: Although the application will run without the contract being properly configured, the features won't work correctly.


## Deploying the application

### Azure

#### Blockchain

#### Create a node

Follow the steps described [here](https://github.com/Microsoft/computerscience/blob/master/Labs/Azure%20Services/Blockchain%20on%20Azure%20(Rate%20My%20Professor)/Blockchain%20on%20Azure.md#Exercise1) to create a blockchain on Azure. As described in the steps, make sure to save the `Wallet address`, `Wallet Password` and `Ethereum Node URL`.

*Note: The default instance size (with 4GB of RAM) will run out of memory very often*

Next, we need to modify Azure's blockchain node startup script to expose the personal API, so the application can unlock the account programmatically. Please notice this is only for demonstration purposes and should not be done in a Production environment. The safest and best approach here should be to sign the transactions as suggested [here](https://social.msdn.microsoft.com/Forums/azure/en-US/aaeab51e-ed79-44f7-a096-189720d0d515/how-should-i-enable-the-api8217s-8216personal8217-and-8216admin8217-over-rpc-on-azure?forum=azureblockchain).

Modify the startup script:

* ssh into the azure's blockchain node following the first 3 steps  [here](https://github.com/Microsoft/computerscience/blob/master/Labs/Azure%20Services/Blockchain%20on%20Azure%20(Rate%20My%20Professor)/Blockchain%20on%20Azure.md#exercise-2-unlock-the-coinbase-account).
* Then use an editor to open the file `start-private-blockchain.sh`.
* Find the `# Start geth node` block and modify the `geth` command by adding the following parameters: `--rpcapi "eth,web3,personal"`.
* Restart the node via azure portal

##### Deploy the contract

* Modify the file `truffle/truffle.js` to point to the node created on the Blockchain step.
* Run `truffle compile`
* Run `truffle deploy`

As described in [here](https://github.com/Microsoft/computerscience/blob/master/Labs/Azure%20Services/Blockchain%20on%20Azure%20(Rate%20My%20Professor)/Blockchain%20on%20Azure.md#exercise-3-deploy-a-smart-contract), make sure to save the `Contract address`.

#### Web APP

To deploy the application:

* create a new WebAPP with Node capabilities (Node Version: 10+).
* SSH into the web app's server:
![SSH into the WebAPP server](http://www.clipular.com/c/6496011519000576.png?k=Q9YZbVvzqD-Bs5SboPZHJ5ku9zU)
* Install git and python:
```
apk add --update \
    python \
    python-dev \
    git \
    git-core
```
* Set up the environment variables using the values you saved from the Blockchain deployment
![Set up the environment variables](http://www.clipular.com/c/5829696500269056.png?k=wGo_EUxOgz2I3Odlx33eFlaUSyM)


##### Security

By default, the virtual network created by Azure will be open to any source addresses. This makes the server vulnerable to DoS attacks. To fix this, limit the access to the virtual network. To do that:

* Access the WebApp's properties and copy the `OUTBOUND IP ADDRESSES`:
![Outbound IP Addresses](http://www.clipular.com/c/6212121864699904.png?k=JJHm343NqE90hW82JEME8d3-6U0)
* Access the tx virtual network and modify the `allow-geth-rpc` inbound rule to restrict the source to `Ip Addresses` and use web app's outbound ones:
![Restrict Access to the Network](http://www.clipular.com/c/5095233705213952.png?k=ydVjWjbNcIHFkExjx0jkwIRwsmk)
