const express = require('express')
const app = express()
const port = 3000

const request = require('request');
var path = require('path');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var geopoints = [];

function giveip(st)
{
    console.log(st.length);
    var outarr = [];
    var querystring = "";
    for(var i = 0; i < st.length; i++)
    {
      var temp = "";
      var b = true;
      var g = 0;

    for(var j = 0; j < st[i].length ; j++)
    {
      if(st[i][j]=='*')
      b = false;
      if(j>0 && st[i][j]=='s' && st[i][j-1]=='m'){
      g++;continue;}
      
      if(g == 3)
      temp = temp + st[i][j];

    }
    if(b == true && g == 3)
    {
      temp = temp.trim();
      outarr.push(temp);
    }

  }

  return outarr;
}

//------------------------------------------
function getreq(url,data)





//-----------------------------------------

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
       if (error !== null){ 
           console.log('exec error: ' + error);
           res.render("output.ejs",{outputpipe:"cant reach to the server you asked."});
       }
       else
       {
        var st = outputpipe.split(/\r?\n/);
        console.log(st);
        var iparr = giveip(st);

               
                for(var i = 1; i < 3 ; i++){  
                      var mainurl = 'http://api.ipstack.com/';
                      var middleurl = iparr[i];
                      //middleurl has to made of ips seperated by commas
                      var apikey = '?access_key=fce13c65c996f0aa4a5c3193f0a5150b&fields=latitude,longitude';
                      var requrl = mainurl + middleurl + apikey;
      
                     request(requrl, { json: true }, (err, res, body) => {
                      if (err){
                          console.log(err);
                          return [];
                      }
                      else
                      {
                        var lat = body.latitude;
                        var long = body.longitude;
                        var ps = []
                        ps.push(long);
                        ps.push(lat);
                        geopoints.push(ps);
                        //console.log(long + " " + lat);
                      }
                         
                      
                      });
                      

                }
                
          console.log(geopoints);
          res.render("copy.ejs",{pipe:geopoints});
       }
         
       
     
    });   
})
app.get('/pip',(req,res) => {
    
    res.render('copy.ejs',{pipe:[[81.595354456456456,25.578121546456546],[-77.032, 38.913],[-36.954105,-5.402580]]});
})
app.post('/geo' , (req,res) => {
 
  var ip = req.body.ip;
  var mainurl = 'http://api.ipstack.com/'
  var middleurl = ''
  //middleurl has to made of ips seperated by commas
  var apikey = '?access_key=fce13c65c996f0aa4a5c3193f0a5150b'
  var requrl = mainurl + middleurl + apikey

  request(requrl, { json: true }, (err, res, body) => {
  if (err)
      console.log(err);
  else
      console.log(body);
  
});

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})