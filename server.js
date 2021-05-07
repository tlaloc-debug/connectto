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

var corsOptions = {
    origin: '*',
}

app.use(cors(corsOptions));

app.use(bodyparser.json());

config.ssl = {
    rejectUnauthorized: false
  }
const pool = new Pool(config)

var sympA=false;
var sympB=false;
var sympC=false;
var sympD=false;
var sympE=false;
var sympF=false;
var sympG=false;
var sympH=false;
var sympI=false;
var sympJ=false;
var sympK=false;
var sympL=false;
var sympM=false;

var date;

app.post("/searchpicname", (req, res) => {
    picName = req.body.picName;
    res.send("done");
})

app.get("/searchpic", (req, res) => {
    picName="%"+picName+"%";
    pool.query("select * from shop where productshop like $1", [picName], function(err, result) {
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




app.post("/data", (req,res) => {
    symp=req.body.data;
    if (symp==="sympa") {sympA=true}
    if (symp==="sympb") {sympB=true}
    if (symp==="sympc") {sympC=true}
    if (symp==="sympd") {sympD=true}
    if (symp==="sympe") {sympE=true}
    if (symp==="sympf") {sympF=true}
    if (symp==="sympg") {sympG=true}
    if (symp==="symph") {sympH=true}
    if (symp==="sympi") {sympI=true}
    if (symp==="sympj") {sympJ=true}
    if (symp==="sympk") {sympK=true}
    if (symp==="sympl") {sympL=true}
    if (symp==="sympm") {sympM=true}
    
})

app.post("/negative", (req, res) => {
    pool.query("INSERT INTO welders (name, general, sympa, sympb, sympc, sympd, sympe, sympf, sympg, symph, sympi, sympj, sympk, sympl, sympm) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", ["Erick Diaz", false, false, false, false, false, false, false, false, false, false, false, false, false, false ], 
    (err, result)=>{
        if (err){
            console.log(err);
        }else {
            console.log(result);
        }
    });
})

app.post("/positive", (req, res) => {
    console.log(sympA)
    pool.query("INSERT INTO welders (name, general, sympa, sympb, sympc, sympd, sympe, sympf, sympg, symph, sympi, sympj, sympk, sympl, sympm) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", ["Erick Diaz", true, sympA, sympB, sympC, sympD, sympE, sympF, sympG, sympH, sympI, sympJ, sympK, sympL, sympM ], 
    (err, result)=>{
        if (err){
            console.log(err);
        }else {
            console.log(result);
        }
    });
})

app.post("/reqconsultA", (req, res) => {
    date = req.body.senddate;
    res.send("done");
})

app.get("/resconsultA", (req, res) => {
    date=date+"%";
    pool.query("SELECT name FROM welders where date like %1", [date], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.send(result.rows);
    });  
});

app.post("/reqconsultB", (req, res) => {
    date = req.body.senddate;
    res.send("done");
})

app.get("/resconsultB", (req, res) => {
    date=date+"%";
    pool.query("SELECT name FROM welders where general = $1 and date like $2", [true, date], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.send(result.rows);
    });  
});

app.post("/reqconsultC", (req, res) => {
    date = req.body.senddate;
    res.send("done");
})

app.get("/resconsultC", (req, res) => {
    date=date+"%";
    pool.query("SELECT * FROM welders where general = $1 and date like $2", [true, date], function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.send(result.rows);
    });  
});


app.listen(process.env.PORT, () => {
    console.log("running")
});
