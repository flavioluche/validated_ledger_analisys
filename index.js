const fetch = require('node-fetch');
const objectsToCSV = require("objects-to-csv");
//const fs = require('fs');

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

const callsErrorCounter = 0;

let SuccessCounter = 0;

let data = []

async function getData(){
    
    try{

        const response = await fetch(call, rippleBody);
    
        const messageData = await response.json();
        
        if (response.status === 200){
            if (SuccessCounter <= 600) {
                
                SuccessCounter++;
                
                data.push([messageData.result.info.time, messageData.result.info.validated_ledger.seq]);
    
            } else {
                const csv = new objectsToCSV(data);
                await csv.toDisk('./data.csv');
                clearInterval(rippleValidatedLedger);
                console.log('ledger_analisys script is finished. The data has been saved on data.csv.');
                console.log('Success calls to rippled API: ' + SuccessCounter +", and failed calls: " + callsErrorCounter);
            }
        } else {
            
            callsErrorCounter++;    
        }
    } catch (error) {
        console.log("An error ocurred: " + error);
        clearInterval(rippleValidatedLedger);
    }
    
}

const rippleValidatedLedger = setInterval(getData, 100);
console.log("validated_ledger_analisys script is running...");