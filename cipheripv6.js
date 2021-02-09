


//------------------------------------------->>>Testing points functions start
app.get('/pip',(req,res) => {
    
  res.render('copy.ejs',{pipe:[[81.595354456456456,25.578121546456546],[-77.032, 38.913],[-36.954105,-5.402580]]});
})
//------------------------------------------->>>>Testing points functions end
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);
filterOption.addEventListener("click", filterTodo);

//Functions

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  //Save to local - do this last
  //Save to local
  saveLocalTodos(todoInput.value);
  //
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  todoInput.value = "";
  //Create Completed Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  //Create trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //attach final Todo
  todoList.appendChild(todoDiv);
}
const express = require('express')
const app = express()
const port = 3000

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

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    // e.target.parentElement.remove();
    const todo = item.parentElement;
    todo.classList.add("fall");
    //at the end
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", e => {
      todo.remove();
    });
  }
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    console.log(todo);
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function(todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
    }
  });
}

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function(todo) {
    //Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    todoInput.value = "";
    //Create Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //attach final Todo
    todoList.appendChild(todoDiv);
  });
}