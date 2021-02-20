const { Pool } = require('pg');
const { parse } = require('pg-connection-string')
const express = require("express");
const connectionString = "postgres://gzktjpucjxdkmo:0ec1951cf76f6691d53b64fb442d2106444eb6a270b3c9e03bc7889763140649@ec2-3-214-3-162.compute-1.amazonaws.com:5432/dffovek21dt59u";
const config = parse(connectionString)
const app=express();

config.ssl = {
    rejectUnauthorized: false
  }
const pool = new Pool(config)

var sql = "SELECT * FROM shop";

app.get("/shop", (req, res) => {
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

app.listen(process.env.PORT, () => {
    console.log("running")
});
