const fetch = require('node-fetch');
//const objectsToCSV = require("objects-to-csv");
const fs = require('fs');

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

let tempSuccessCounter = 0;

let data = [];

async function getData(){
    try{

        const response = await fetch(call, rippleBody);
    
        const messageData = await response.json();
        
        if (response.status === 200){
            if (tempSuccessCounter <= 5) {
                
                tempSuccessCounter++;
                
                data.push([messageData.result.info.validated_ledger.seq, messageData.result.info.time]);
    
            } else {
                /* const csv = new objectsToCSV(data);
                await csv.toDisk('./data.csv'); */
                await fs.writeFile('data.txt', data, (err) => {
                    
                    if(err) throw err;
                    
                })
                console.log('ledger_analisys script is finished. Success calls to rippled API: ' + tempSuccessCounter +", and failed calls: " + callsErrorCounter);
                clearInterval(rippleValidatedLedger);
            }
        } else {
    
            callsErrorCounter++;    
        }
    } catch (error) {
        console.log("An error ocurred: " + error);
        clearInterval(rippleValidatedLedger);
    }
}

const rippleValidatedLedger = setInterval(getData, 1000);
console.log("ledger_analisys script is running...");