const express = require('express')
const app = express()
const port = 3000 || process.env.PORT 

const fetch = require("node-fetch");
const request = require('request');
var path = require('path');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


function giveip(st)
{
    //console.log(st.length);
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
  if(outarr.length > 1)
  outarr[1] = "106.51.8.241";
  return outarr;

}

async function give_json_array(arr)
{
    var ans = [];
      for(var i = 1; i < arr.length ; i++)
      {
        var mainurl = 'http://api.ipstack.com/';
        var middleurl = arr[i];
        var apikey = '?access_key=fce13c65c996f0aa4a5c3193f0a5150b&fields=latitude,longitude';
        
        var requrl = mainurl + middleurl + apikey;
        const response = await fetch(requrl);
        const restext = await response.json();
        var lat = restext.latitude;
        var long = restext.longitude;
        if(lat != null && long != null)
        ans.push([long,lat]);
      }
      return ans;
}

app.get('/',(req,res) => {
  res.sendFile(
		path.join(__dirname+"/hello.html"));
});


app.post('/findway', (req, res) => {
      
      var command = "tracert -d -w 100 ";
      var locator = String(req.body.urlname)
      command = command + locator;
      //console.log(req.body.urlname)
      var outputpipe;
      
      
      var exec = require('child_process').exec;
        var child;
        child = exec(command,
              function (error, stdout, stderr) {
                
                outputpipe = String(stdout);
                if (error !== null){ 
                    //console.log('exec error: ' + error);
                    res.render("output.ejs",{outputpipe:"Enter valid server name please"});
                }
                else
                {
                  var st = outputpipe.split(/\r?\n/);
                  //console.log(st);
                  var iparr = giveip(st);
                  if(iparr.length == 0)
                      return res.render("output.ejs",{outputpipe:"Path does not exists!"});
                   give_json_array(iparr).then(value => {
                   // console.log(value);
                   return res.render("copy.ejs",{pipe:value});
                    }).catch(err => {
                      res.render("output.ejs",{outputpipe:"Server Error!!"});
                    });
                }
         });   
  });



//------------------------------------------->>>Testing points functions start
app.get('/pip',(req,res) => {
    
  res.render('copy.ejs',{pipe:[[81.595354456456456,25.578121546456546],[-77.032, 38.913],[-36.954105,-5.402580]]});
})
//------------------------------------------->>>>Testing points functions end
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})