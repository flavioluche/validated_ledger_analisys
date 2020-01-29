const fetch = require('node-fetch');
const objectsToCSV = require("objects-to-csv");
//const fs = require('fs');

const rippleBody = {
    method: 'POST',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: JSON.stringify({
        method: "server_info",
        params: [{}]
    })
};

const call = 'https://s1.ripple.com:51234/server_info';

const callsErrorCounter = 0;

let successCounter = 0;

let data = []

let seq = 0;
let time = 0;

async function getData() {
    if (successCounter <= 1) {

        try {

            const response = await fetch(call, rippleBody);

            const messageData = await response.json();

            if (response.status === 200) {

                let tempTime = messageData.result.info.time;
                successCounter++;

                if (seq === messageData.result.info.validated_ledger.seq){
                    
                    tempTime = messageData.result.info.time;
                    time = Number(temp.getSeconds() + '.' + temp.getMilliseconds());
                    
                } else {

                    data.push([messageData.result.info.time, messageData.result.info.validated_ledger.seq]);
                    seq = messageData.result.info.validated_ledger.seq;

                }

            } else {

                callsErrorCounter++;
            }
        } catch (error) {
            console.log("An error ocurred: " + error);
            clearInterval(rippleValidatedLedger);
        }

    } else {
        const csv = new objectsToCSV(data);
        await csv.toDisk('./data.csv');
        console.log(removeDuplicates(data));
        clearInterval(rippleValidatedLedger);
        console.log('ledger_analisys script is finished. The data has been saved on data.csv.');
        console.log('Success calls to rippled API: ' + successCounter + ", and failed calls: " + callsErrorCounter);
    }

}

function removeDuplicates(array) {
    let a = []
    array[1].map(x => {
      if(!a.includes(x[1])) {
        a.push(x)
      }
    return a;
    })
  };
const rippleValidatedLedger = setInterval(getData, 100);
console.log("validated_ledger_analisys script is running...");