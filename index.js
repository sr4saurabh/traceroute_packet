const express = require('express')
const app = express()
const port = 3000



app.get('/', (req, res) => {
 var command = "ls";
 var outputpipe;
 var exec = require('child_process').exec;
  var child;
  child = exec(command,
    function (error, stdout, stderr) {
       //console.log('stdout: ' + stdout);
       //console.log('stderr: ' + stderr);
       outputpipe = String(stdout);
       if (error !== null) {
           console.log('exec error: ' + error);
       }
       else
       {
          
          res.render("output.ejs",{outputpipe:outputpipe});
       }
      // res.render("output.ejs");
    });
    
    //res.send("bhai ye to ho rha h")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})