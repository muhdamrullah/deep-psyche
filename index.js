// index.js start of file
var express = require('express')
    , cors = require('cors');
var multer = require('multer'),
        bodyParser = require('body-parser'),
        path = require('path');
var oxfordEmotion = require("node-oxford-emotion")('<insert here>');
var fs = require('fs');
var jsend = require('jsend');
var request = require('request');

var app = new express();
app.use(bodyParser.json());
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('index');
});

// index.js continued
app.post('/', multer({ dest: './uploads/'}).single('imgFile'), function(req,res){
	// This is the form fields
        console.log(req.body);
        console.log(req.file);
        console.log(req.file.path);

	// This prepares to send the URL to the external server
        var baseimageURL = '<insert server url here>/' + req.file.filename;
	var MIT = request('<insert special url here>' + baseimageURL, function (error, response, data) {
	    if (!error && response.statusCode == 200) {
	    var MITData = JSON.parse(data)

	    // This is a test to check that data received is correct
            console.log(MITData);
	    console.log(MITData.heatmap);

	    // This uses the fs and request library to download image off the external server
	    var specialrequest = request(MITData.heatmap)
	    specialrequest.on('response',  function (res) {
  	  	res.pipe(fs.createWriteStream('./uploads/' + req.file.filename + '.' + res.headers['content-type'].split('/')[1]));
		});

	    // This prepares the post image processing URL
	    var postimageURL = '<insert server url here>/' + req.file.filename + '.jpeg' 
	    };

	    // This sends the data in the jsend-compatible format
	    var jsendData = jsend.success({ recall_score: MITData.memscore, base_image_url: baseimageURL, heatmap_url : postimageURL}); 
            res.json(jsendData).end();
            });
});

app.use(express.static(__dirname + '/uploads'));

var port = 3000;
app.listen( port, function(){ console.log('listening on port '+port); } );
