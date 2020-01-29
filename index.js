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

async function getData() {
    if (successCounter <= 600) {

        try {

            const response = await fetch(call, rippleBody);

            const messageData = await response.json();

            if (response.status === 200) {

                successCounter++;

                data.push([messageData.result.info.time, messageData.result.info.validated_ledger.seq]);

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