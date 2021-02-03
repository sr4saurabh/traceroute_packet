const express = require('express')
const app = express()
const port = 3000

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})