import { Ed25519Keypair, JsonRpcProvider, Network, RawSigner} from '@mysten/sui.js';
import {ethers} from 'ethers';
import fs from 'fs'

// 文件路径
const ACCOUNT_FILE_PATH = "";

const provider = new JsonRpcProvider(Network.DEVNET);

main();

async function main() {
    // 生成随机钱包
    var account = getWallet();
    console.log("Account: " + JSON.stringify(account));
    // 领水
    await requestSuiFromFaucet(account);
    // mint NFT
    await mintExample(account);
}

/**
 * mint一个Example NFT
 * @param {*} account 账号
 */
 async function mintExample(account) {
    var signer = new RawSigner(account.keypair, provider);
    var signResult = await signer.executeMoveCall({
        packageObjectId: "0x0000000000000000000000000000000000000002",
        module: "devnet_nft",
        function: "mint",
        typeArguments: [],
        arguments: ["Example NFT","An NFT created by Sui Wallet","ipfs://QmZPWWy5Si54R3d26toaqRiqvCH7HkGdXkxwUgCm2oKKM2?filename=img-sq-01.png"],
        gasBudget: 10000
    });
    console.log(signResult)
}

/**
 * 领水
 * @param {*} account 钱包
 */
async function requestSuiFromFaucet(account) {
    var result = await provider.requestSuiFromFaucet(
        account.address
    );
    console.log(result);
}

/**
 * 生成账号
 */
function generateAccount() {
    for (let index = 0; index < 100; index++) {
        var account = getWallet();
        var line = account.phrase + "\t" + account.address + "\n";
        fs.appendFile(ACCOUNT_FILE_PATH, line, (err) => { 
            if (err) { 
              console.log(err); 
            } 
        }); 
        console.log(index + ":" + line);
    }
}

/**
 * 获取一个随机钱包
 * @returns 返回钱包对象
 */
function getWallet() {
    var wallet = ethers.Wallet.createRandom();
    var phrase = wallet.mnemonic.phrase;
    var keypair = Ed25519Keypair.deriveKeypair(phrase);
    return {"phrase": phrase, "address": keypair.getPublicKey().toSuiAddress(), "keypair": keypair};
}
