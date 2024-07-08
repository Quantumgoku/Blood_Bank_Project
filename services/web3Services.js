const  {Web3} = require('web3');
const fs = require('fs');
const path = require('path');

const contractJSONPath = path.resolve(__dirname, '../build/contracts/BloodDonation.json');
const contractJSON = JSON.parse(fs.readFileSync(contractJSONPath, 'utf8'));
const abi = contractJSON.abi;
const contractAddress = process.env.CONTRACT_ADDRESS || contractJSON.networks['5777'].address;

console.log("Hello");

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
//console.log(web3);
// Create a contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

module.exports = {
    web3,
    contract
};
