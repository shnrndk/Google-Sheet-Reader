var express = require('express')
var app = express()
var fs = require("fs");
const GoogleSpreadSheet = require('google-spreadsheet');
const {
    promisify
} = require('util');

const creds = require('./client_secret.json');

app.get('/', function(req, res) {
    async function accessSpreadsheet() {
        const doc = new GoogleSpreadSheet('1E2T9vdPy1xu9WSIZvgdeoRFDn3jPmX4UB3IVaZICNvw');
        await promisify(doc.useServiceAccountAuth)(creds);
        const info = await promisify(doc.getInfo)();
        const sheet = info.worksheets[0];

        const rows = await promisify(sheet.getRows)({
            offset: 1
        });

        function printtable(data) {
            logger.write(`Time_Stamp:${data.timestamp}`) // append string to your file
            logger.write(` Scanned Data:${data.scanneddata} \n`) // again
        }

        var logger = fs.createWriteStream('log.txt', {
            flags: 'a' // 'a' means appending (old data will be preserved)
        })

        rows.forEach(row => {
            printtable(row);
        });
        logger.end()
    }
    accessSpreadsheet();
})


app.listen(3000);