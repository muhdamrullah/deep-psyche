// index.js start of file
var express = require('express'),
    cors = require('cors')
    multer = require('multer'),
    bodyParser = require('body-parser'),
    path = require('path');
    fs = require('fs');
    jsend = require('jsend');
    request = require('request');

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
	var baseURL = '<insert local server here>/uploads'
        var baseimageURL = baseURL + req.file.filename;
	var MIT = request('<insert special server here>'+baseimageURL, function (error, response, data) {
	    if (!error && response.statusCode == 200) {
	    var FacerecogData = JSON.parse(data)

	    // This is a test to check that data received is correct
            console.log(FacerecogData);
	    console.log(FacerecogData.heatmap);

	    // This uses the fs and request library to download image off the external server
	    var specialrequest = request(FacerecogData.heatmap)
	    specialrequest.on('response',  function (res) {
  	  	res.pipe(fs.createWriteStream('./uploads/' + req.file.filename + '.' + res.headers['content-type'].split('/')[1]));
		});	    

	    // This prepares the post image processing URL
	    var postimageURL = baseURL + req.file.filename + '.jpeg' 
	    };

	    // This sends the data in the jsend-compatible format
	    var jsendData = jsend.success({ recall_score: MITData.memscore, base_image_url: baseimageURL, heatmap_url : postimageURL}); 

	    // Check file exist
	    specialrequest.on('close', function () {
		console.log('Finished Download');
	    });

	    // Sets 2 second delay
	    res.write('<html><head><title>Facerecog Asia</title><link href="./public/index.css" rel="stylesheet"></head><body><div class="wrapper"><div class="inner"><img class="img" src="./'+ req.file.path +'" /></div><div class="inner"><img class="img" src="./'+ req.file.path +'.jpeg" style="opacity:0.5" /></div><h2>Predicted Recall Rate: '+jsendData.data.recall_score+'</h2></div></body></html>');
	    setInterval(function() {
		res.end();
	    },2000);

//            res.json(jsendData).end();
            });
});

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/public', express.static(__dirname + '/public'));

var port = 5000;
app.listen( port, function(){ console.log('listening on port '+port); } );
