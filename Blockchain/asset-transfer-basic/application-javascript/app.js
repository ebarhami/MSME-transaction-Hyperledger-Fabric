/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { v4: uuidv4 } = require('uuid');
const { Gateway, Wallets, Wallet } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'rudiiiii';

const privateKey = '-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgAkdi85wZmiU6UEJV\r\nzFeQjqmkydtI9BzHq9L819br/OChRANCAAQxpMjONT++8vKezUZwmU+bnn6uAB+W\r\nC4DID28CWVe2jsSShpNjPRT8WinjMYtX6wxQW9fI1spyI8cbrmb6TB4B\r\n-----END PRIVATE KEY-----\r\n';
const certs = '-----BEGIN CERTIFICATE-----\nMIICfjCCAiSgAwIBAgIUMKus2/8D3/Q2lni1yEwV6oMENNowCgYIKoZIzj0EAwIw\ncDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMQ8wDQYDVQQH\nEwZEdXJoYW0xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh\nLm9yZzEuZXhhbXBsZS5jb20wHhcNMjAwOTA3MTA1NDAwWhcNMjEwOTA3MTA1OTAw\nWjBBMTAwDQYDVQQLEwZjbGllbnQwCwYDVQQLEwRvcmcxMBIGA1UECxMLZGVwYXJ0\nbWVudDExDTALBgNVBAMTBHJ1ZGkwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQx\npMjONT++8vKezUZwmU+bnn6uAB+WC4DID28CWVe2jsSShpNjPRT8WinjMYtX6wxQ\nW9fI1spyI8cbrmb6TB4Bo4HKMIHHMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8E\nAjAAMB0GA1UdDgQWBBTzjJYfsDlaWt96EUTQo0ujYOt7/TAfBgNVHSMEGDAWgBSF\nnCvf0OImmiiY18N60Et196iMmzBnBggqAwQFBgcIAQRbeyJhdHRycyI6eyJoZi5B\nZmZpbGlhdGlvbiI6Im9yZzEuZGVwYXJ0bWVudDEiLCJoZi5FbnJvbGxtZW50SUQi\nOiJydWRpIiwiaGYuVHlwZSI6ImNsaWVudCJ9fTAKBggqhkjOPQQDAgNIADBFAiEA\n3SdoVSiHwesxWJih3h/1NX89/z9BFi8b/eoDY0Y1KyQCIAS92xvPrUsqA8Pqci2S\n//UTt1cPRIZAtCEyob89ZytL\n-----END CERTIFICATE-----\n';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

// build an in memory object with the network configuration (also known as a connection profile)
const ccp = buildCCPOrg1();

// build an instance of the fabric ca services client based on
// the information in the network configuration
const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

// await wallet.put(org1UserId, x509Identity);

(async function () {
	global.wallet = await buildWallet(Wallets, walletPath);
	// in a real application this would be done on an administrative flow, and only once
	await enrollAdmin(caClient, wallet, mspOrg1);
})()

const gateway = new Gateway();

var express = require('express');
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = 3000

// const x509Identity = {
// 	credentials: {
// 		certificate: 'tes',
// 		privateKey: 'tes',
// 	},
// 	mspId: 'orgMspId',
// 	type: 'X.509',
// };

app.get('/tes', async (req, res) => {
	try {
		res.send('ENSOF');
	} catch (error) {
		res.end();
	}
})

app.post('/register', async (req, res) => {
	try {
		var username = req.body.username
		var first_name = req.body.first_name
		var last_name = req.body.last_name

		// in a real application this would be done on an administrative flow, and only once

		var identity = await registerAndEnrollUser(caClient, wallet, mspOrg1, username, 'org1.department1');

		await gateway.connect(ccp, {
			wallet,
			identity: username,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		// console.log('\n--> Submit Transaction: Register');
		// let result = await contract.submitTransaction("Register", username, first_name, last_name);
		// console.log(`*** Result: committed ${result}`);

		gateway.disconnect();
		res.setHeader('Content-Type', 'application/json');
		res.send(identity);		
	
	} catch (e) {
		console.log('error')
		//this will eventually be handled by your error handling middleware
		res.status(500).send(e);
	}
})


app.post('/login', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	try {
		var username = req.body.username
		var identity = req.body.identity

		
		var validate = await wallet.get(username)
		if (JSON.stringify(validate) != JSON.stringify(identity)) {
			return res.status(500).end("incorrect username/identity");
		}

		await gateway.connect(ccp, {
			wallet,
			identity: username,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// // Build a network instance based on the channel where the smart contract is deployed
		// const network = await gateway.getNetwork(channelName);

		// // Get the contract from the network.
		// const contract = network.getContract(chaincodeName);

		// console.log('\n--> Submit Transaction: Register');
		// let result = await contract.submitTransaction('GetMyAssets', username);
		// console.log(`*** Result: committed ${result}`);

		gateway.disconnect();
		console.log('login success');
		res.status(200).send(identity);

	} catch (e) {
		console.log('error' + e);
		//this will eventually be handled by your error handling middleware
		res.status(500).send(e);
	}
})

app.post('/create-asset', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	try {
		var username = req.body.username
		var identity = req.body.identity

		var id = uuidv4();
		var category = req.body.category
		var name = req.body.name
		var price = req.body.price

		var validate = await wallet.get(username)
		if (JSON.stringify(validate) != JSON.stringify(identity)) {
			return res.status(500).end("incorrect username/identity");
		}

		await gateway.connect(ccp, {
			wallet,
			identity: username,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		console.log('\n--> Submit Transaction: Register');
		let result = await contract.submitTransaction('CreateAsset', id, category, name, username, price);
		console.log(`*** Result: committed ${result}`);

		gateway.disconnect();
		
		res.status(200).send(result);

	} catch (e) {
		console.log('error' + e);
		//this will eventually be handled by your error handling middleware
		res.status(500).send(e);
	}
})

app.post('/my-asset', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	try {
		var username = req.body.username
		var identity = req.body.identity

		var validate = await wallet.get(username)
		if (JSON.stringify(validate) != JSON.stringify(identity)) {
			return res.status(500).end("incorrect username/identity");
		}

		await gateway.connect(ccp, {
			wallet,
			identity: username,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		console.log('\n--> Submit Transaction: Register');
		let result = await contract.submitTransaction('GetMyAssets', username);
		console.log(`*** Result: committed ${result}`);

		gateway.disconnect();
		
		res.status(200).send(result);

	} catch (e) {
		console.log('error' + e);
		//this will eventually be handled by your error handling middleware
		res.status(500).send(e);
	}
})

app.post('/issued-asset', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	try {
		var username = req.body.username
		var identity = req.body.identity

		var validate = await wallet.get(username)
		if (JSON.stringify(validate) != JSON.stringify(identity)) {
			return res.status(500).end("incorrect username/identity");
		}

		await gateway.connect(ccp, {
			wallet,
			identity: username,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		console.log('\n--> Submit Transaction: issued asset');
		let result = await contract.submitTransaction('GetIssuedAssets');
		console.log(`*** Result: committed ${result}`);

		gateway.disconnect();
		
		res.status(200).send(result);

	} catch (e) {
		console.log('error' + e);
		//this will eventually be handled by your error handling middleware
		res.status(500).send(e);
	}
})

app.post('/my-report', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	try {
		var username = req.body.username
		var identity = req.body.identity

		var validate = await wallet.get(username)
		if (JSON.stringify(validate) != JSON.stringify(identity)) {
			return res.status(500).end("incorrect username/identity");
		}

		await gateway.connect(ccp, {
			wallet,
			identity: username,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		console.log('\n--> Submit Transaction: issued asset');
		let result = await contract.submitTransaction('GetMyReport', username);
		console.log(`*** Result: committed ${result}`);

		gateway.disconnect();
		
		res.status(200).send(result);

	} catch (e) {
		console.log('error' + e);
		//this will eventually be handled by your error handling middleware
		res.status(500).send(e);
	}
})

app.post('/buy', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	try {
		var username = req.body.username;
		var identity = req.body.identity;

		var id = req.body.id;

		var validate = await wallet.get(username)
		if (JSON.stringify(validate) != JSON.stringify(identity)) {
			return res.status(500).end("incorrect username/identity");
		}

		await gateway.connect(ccp, {
			wallet,
			identity: username,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		console.log('\n--> Submit Transaction: issued asset');
		let result = await contract.submitTransaction('BuyAsset', id, username);
		console.log(`*** Result: committed ${result}`);

		gateway.disconnect();
		
		res.status(200).send(result);

	} catch (e) {
		console.log('error' + e);
		//this will eventually be handled by your error handling middleware
		res.status(500).send(e);
	}
})

app.post('/issue-token', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	try {
		var username = req.body.username;
		var identity = req.body.identity;

		var amount = req.body.amount;

		var validate = await wallet.get(username)
		if (JSON.stringify(validate) != JSON.stringify(identity)) {
			return res.status(500).end("incorrect username/identity");
		}

		await gateway.connect(ccp, {
			wallet,
			identity: username,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		// console.log('\n--> Submit Transaction: issued asset');
		// let result = await contract.submitTransaction('IssueToken', amount);
		// console.log(`*** Result: committed ${result}`);

		gateway.disconnect();
		
		res.status(200).send(result);

	} catch (e) {
		console.log('error' + e);
		//this will eventually be handled by your error handling middleware
		res.status(500).send(e);
	}
})

app.post('/send-token', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	try {
		var username = req.body.username;
		var identity = req.body.identity;

		var amount = req.body.amount;
		var recipient = req.body.recipient;

		var validate = await wallet.get(username)
		if (JSON.stringify(validate) != JSON.stringify(identity)) {
			return res.status(500).end("incorrect username/identity");
		}

		await gateway.connect(ccp, {
			wallet,
			identity: username,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		console.log('\n--> Submit Transaction: issued asset');
		let result = await contract.submitTransaction('BuyAsset', id, username);
		console.log(`*** Result: committed ${result}`);

		gateway.disconnect();
		
		res.status(200).send(result);

	} catch (e) {
		console.log('error' + e);
		//this will eventually be handled by your error handling middleware
		res.status(500).send(e);
	}
})

app.listen(port, () => console.log('listening to port ' + port))
