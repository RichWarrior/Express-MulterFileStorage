var express = require("express");
var multer = require('multer');
var cors = require('cors');
var fs = require('fs')
var app = express();

app.use(cors())

var fileName = "";
var extension = "";

fs.readFile(process.cwd() + "\\config.json", function (err, data) {
    if (err) {
        server.close();
        console.log('Config dosyası okunamadı.')
    }
    else {
        var _json = JSON.parse(data);
        if (!_json.fileName || !_json.extension) {
            server.close();
            console.log('Config dosyası hatalı.')
        }
        else {
            fileName = _json.fileName;
            extension = _json.extension;
        }
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, fileName + '.' + extension);
    }
});


var upload = multer({ storage: storage }).single('file');
app.post('/', function (req, res) {
    var isOk = false;
    upload(req, res, function (err) {
        if (err) {
            isOk = false;
        }
        isOk = true;
        const result = {
            text: isOk ? 'successfull' : 'unsuccessfull'
        }
        return res.end(JSON.stringify(result))
    });
});
var server = app.listen(7000, function () {
    console.log(`Multer file storage api 7000 port listening...`);
});

