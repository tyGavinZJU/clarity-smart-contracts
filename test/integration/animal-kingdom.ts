const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  FungibleConditionCode,
  standardPrincipalCV,
  StacksTestnet,
  broadcastTransaction,
  makeStandardSTXPostCondition,
  bufferCV,
} from "@blockstack/stacks-transactions";

const STACKS_API_URL = "http://127.0.0.1:20443/v2/transactions";

describe("animal kingdom test suite", async () => {
  it("should create a new token", async () => {
    let keys = JSON.parse(fs.readFileSync("./keys.json").toString());
    let keys2 = JSON.parse(fs.readFileSync("./keys2.json").toString());
    const network = new StacksTestnet();
    network.broadcastApiUrl = STACKS_API_URL;
    let contractName = "animalkings";
    let codeBody = fs
      .readFileSync("./contracts/experiments/animal-kingdom.clar")
      .toString();

    let fee = new BigNum(3000);
    let senderKey = keys.secretKey;

    let transaction = await makeSmartContractDeploy({
      contractName,
      codeBody,
      fee,
      senderKey,
      nonce: new BigNum(0),
      network,
    });

    console.log(await broadcastTransaction(transaction, network));

    await new Promise((r) => setTimeout(r, 10000));

    var contractAddress = keys.stacksAddress;
    var functionName = "mint-next";
    var functionArgs = [standardPrincipalCV(keys2.stacksAddress)];

    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      fee: new BigNum(186),
      senderKey,
      nonce: new BigNum(1),
      network,
    });

    console.log(await broadcastTransaction(transaction, network));
  });
});
