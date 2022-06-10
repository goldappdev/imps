const ethers = require('ethers');  
const crypto = require('crypto');

const DAY = 86400

const advanceTime = (time) => {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_increaseTime',
            params: [time],
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err) }
            return resolve(result)
        })
    })
}

const advanceBlock = () => {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_mine',
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err) }
            const newBlockHash = web3.eth.getBlock('latest').hash

            return resolve(newBlockHash)
        })
    })
}

const takeSnapshot = () => {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_snapshot',
            id: new Date().getTime()
        }, (err, snapshotId) => {
            if (err) { return reject(err) }
            return resolve(snapshotId)
        })
    })
}

const revertToSnapShot = (id) => {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_revert',
            params: [id],
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err) }
            return resolve(result)
        })
    })
}

const advanceTimeAndBlock = async (time) => {
    await advanceTime(time)
    await advanceBlock()
    return Promise.resolve(web3.eth.getBlock('latest'))
}

const getProposalId = (tx) => {
    return tx.receipt.logs[0].args.id.toNumber()
}

const generateRandomAccounts = (amount) => {
    const participants = [];
    const balances = [];

    for (let i=0; i<amount; i++) {
        const id = crypto.randomBytes(32).toString('hex');
        const privateKey = "0x"+id;
        const wallet = new ethers.Wallet(privateKey);
        participants.push(wallet.address)
        balances.push(Math.floor(Math.random() * 100000))
    }

    return [participants, balances]
}


module.exports = {
    advanceTime,
    advanceBlock,
    advanceTimeAndBlock,
    takeSnapshot,
    revertToSnapShot,
    getProposalId,
    generateRandomAccounts,
    DAY,
}