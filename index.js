const fetch = require("node-fetch");
const objectsToCSV = require("objects-to-csv");

const rippleBody = { method: 'POST',
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body:JSON.stringify({
                        method: "server_info",
                        params: [{}]
                    })
};

const call = 'https://s1.ripple.com:51234/server_info';

const errorCounter = 0;

let tempSuccessCounter = 0;

let data = [];

async function getData(){
    
    const response = await fetch(call, rippleBody);

    const messageData = await response.json();
    
    if (response.status === 200){
        if (tempSuccessCounter <= 5) {
            tempSuccessCounter++;
            //if (messageData.result.response.info.validated_ledger){
                await data.push([`${messageData.result.info.validated_ledger.age}, ${messageData.result.info.validated_ledger.seq}; ${messageData.result.info.time};`]);
            //}else if(messageData.result.response.info.closed_ledger){
               //await data.push([`EITA ${messageData.result.info.closed_ledger.seq}; ${messageData.result.info.time};`]);
            //}

        } else {
            const csv = new objectsToCSV(data);
            await csv.toDisk('./data.csv');
            console.log('file save. call success ' + tempSuccessCounter +" and fails " + errorCounter);
            rippleValidatedLedger.unref();
        }
    } else {

        errorCounter++;    
    }
}

const rippleValidatedLedger = setInterval(getData, 1000);