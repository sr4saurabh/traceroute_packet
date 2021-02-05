const express = require('express')
const app = express()
const port = 3000

const request = require('request');
var path = require('path');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.get('/',(req,res) => {
  res.sendFile(
		path.join(__dirname+"/start.html"));
})

app.post('/findway', (req, res) => {
 var command = "tracert -d ";
 var locator = String(req.body.urlname)
 command = command + locator;
 console.log(req.body.urlname)
 var outputpipe;
 var exec = require('child_process').exec;
  var child;
  child = exec(command,
    function (error, stdout, stderr) {
       
       outputpipe = String(stdout);
       if (error !== null) 
           console.log('exec error: ' + error);
       else
          res.render("output.ejs",{outputpipe:outputpipe});
       
     
    });    
})

app.post('/geo' , (req,res) => {
  var ip = req.body.ip;
  var mainurl = 'http://api.ipstack.com/'
  var middleurl = ''
  //middleurl has to made of ips seperated by commas
  var apikey = '?access_key=fce13c65c996f0aa4a5c3193f0a5150b'
  var requrl = mainurl + middleurl + apikey
  request('http://api.ipstack.com/106.51.8.242?access_key=fce13c65c996f0aa4a5c3193f0a5150b', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
  console.log(body);
});

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})