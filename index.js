// Include the dependencies

const express = require('express');
const session = require('express-session');
const path = require('path');
const nunjucks = require('nunjucks');

var handlebars = require('handlebars');

const cookieParser = require('cookie-parser');
const cryptography = require('crypto');
const fs = require('fs-extra');

//const fetch = require('node-fetch');
const http = require('http');
const https = require("https");


// Initialize express
const app = express();
const secret_key = 'your secret key';





//var httpServer = http.createServer(app);
//var httpsServer = https.createServer(certificate, app);


// Configure nunjucks template engine
const env = nunjucks.configure('views', {
  	autoescape: true,
  	express: app
});
env.addFilter('formatNumber', num => String(num).replace(/(.)(?=(\d{3})+$)/g,'$1,'));
env.addFilter('formatDateTime', date => (new Date(date).toISOString()).slice(0, -1).split('.')[0]);
// Use sessions and other dependencies
app.use(session({
	secret: secret_key,
	resave: true,
	saveUninitialized: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());
app.use('/favicon.ico', express.static('favico.png'));


app.get('/', (request, response) => {
	// Get all the users account details so we can populate them on the profile page
		// Format the registered date
        let rawdata = fs.readFileSync('results.json');
        let tasks = JSON.parse(rawdata);
        console.log(tasks);
        var date_ob = new Date();
	var day = ("0" + date_ob.getDate()).slice(-2);
	var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	var year = date_ob.getFullYear();
   
	var date = month + "/" + day + "/" + year;

        let numbers = [];

		// Render profile page
		response.render('index.html', { tasks: tasks, today : date, numbers : numbers });
	});



http.createServer(app).listen(80);