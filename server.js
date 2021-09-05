const { Pool } = require('pg');
const { parse } = require('pg-connection-string')
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const connectionString = process.env.DATABASE_URL;
const config = parse(connectionString)
const app=express();

let name;
let picName;

app.use(cors());
app.use(bodyparser.json());

config.ssl = {
    rejectUnauthorized: false
  }
const pool = new Pool(config)

app.post("/searchpicname", (req, res) => {
    picName = req.body.picName;
    res.send("done");
})

app.get("/searchpic", (req, res) => {
    picName="%"+picName+"%";
    pool.query("select * from micros where product like $1", [picName], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.send(result.rows);
    });  
});

var sql = "SELECT * FROM shop";

app.get("/shopall", (req, res) => {
    pool.query(sql, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
    
        // Log this to the console for debugging purposes.
        
        res.send(result.rows);
    
    
    });  
});

app.post("/register", (req, res) => {
    username = req.body.username;
    password = req.body.password;
    avatar = req.body.avatar;
    pool.query('INSERT INTO users (name, password, avatar) values ($1, $2, $3)', [username, password, avatar], 
    function(err, result){
        if (err){
            res.send(err);
        }else {
            res.send(result);
        }
    });
})

app.post("/loginname", (req, res) => {
    name = req.body.username;
    res.send("done");
})

app.get("/login", (req, res) => {
    pool.query("select * from users where name = $1", [name], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.send(result.rows);
    });  
});

app.get("/resconsulta", (req, res) => {
    pool.query("SELECT name FROM welders where date like '2015-10-21'", function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log(result.rows);
        res.send(result.rows);
    });  
});

app.listen(process.env.PORT, () => {
    console.log("running")
});