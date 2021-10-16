const { Pool } = require('pg');
const { parse } = require('pg-connection-string')
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const connectionString = process.env.DATABASE_URL;
const config = parse(connectionString)
const app=express();
var nodemailer = require('nodemailer');

const cheerio = require('cheerio');
const axios = require('axios');

let name;
let picName;

let picMemory; 
let picEeprom; 
let picRam; 
let picPins; 
let picChanels; 
let picResolution; 
let picMax; 
let picTimer8; 
let picTimer16; 
let picSerial; 
let picIntosc; 

let picFamily;

let FirstpicName;
let SecondpicName;

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
    pool.query("select * from micros, analog, digital, family, memorytype, presentation, speeds where product like $1 and micro_id=adc_id and micro_id=dig_id and model=model_id and memorytype=type_id and packages=box_id and micro_id=speed_id", [picName], function(err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.send(result.rows);
    });  
});

app.post("/advancesearchname", (req, res) => {
    picMemory = req.body.picMemory;
    picEeprom = req.body.picEeprom; 
    picRam = req.body.picRam;
    picPins = req.body.picPins;
    picChanels = req.body.picChanels;
    picResolution = req.body.picResolution;
    picMax = req.body.picMax;
    picTimer8 = req.body.picTimer8;
    if (picTimer8) {picTimer8 = 1;}
        else {picTimer8 = 0;}
    picTimer16 = req.body.picTimer16;
    if (picTimer16) {picTimer16 = 1;}
        else {picTimer16 = 0;}
    picSerial = req.body.picSerial;
    if (picSerial==true) picSerial = 'no';
    picIntosc = req.body.picIntosc;
    if (picIntosc) {picIntosc = 1;}
        else {picIntosc = 0;}
    res.send("done");
})

app.get("/advancesearch", (req, res) => {
    pool.query("select * from micros, analog, digital, family, memorytype, presentation, speeds where progmemory>=$1 and eeprom>=$2 and ram>=$3 and pins>=$4 and adc>=$5 and res>=$6 and max>=$7 and timer8>=$8 and timer16>=$9 and serial!=$10 and intosc>=$11 and micro_id=adc_id and micro_id=dig_id and model=model_id and memorytype=type_id and packages=box_id and micro_id=speed_id", [picMemory, picEeprom, picRam, picPins, picChanels, picResolution, picMax, picTimer8, picTimer16, picSerial, picIntosc], function(err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.send(result.rows);
    });  
});

app.post("/searchfamilyname", (req, res) => {
    picFamily = req.body.picFamily;
    res.send("done");
})

app.get("/searchfamily", (req, res) => {
    pool.query("select * from micros, analog, digital, family, memorytype, presentation, speeds where model=$1 and micro_id=adc_id and micro_id=dig_id and model=model_id and memorytype=type_id and packages=box_id and micro_id=speed_id", [picFamily], function(err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.send(result.rows);
    });  
});

app.post("/comparepicname", (req, res) => {
    FirstpicName = req.body.FirstpicName;
    SecondpicName = req.body.SecondpicName;
    res.send("done");
})

app.get("/comparepic", (req, res) => {
    pool.query("select * from micros, analog, digital, family, memorytype, presentation, speeds where product=$1 and micro_id=adc_id and micro_id=dig_id and model=model_id and memorytype=type_id and packages=box_id and micro_id=speed_id union select * from micros, analog, digital, family, memorytype, presentation, speeds where product=$2 and micro_id=adc_id and micro_id=dig_id and model=model_id and memorytype=type_id and packages=box_id and micro_id=speed_id", [FirstpicName, SecondpicName], function(err, result) {
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

app.post("/send-email", (req, res) => {
    emailName = req.body.emailName;
    emailAccount = req.body.emailAccount;
    emailMessage = req.body.emailMessage;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tlalocvideos@gmail.com',
          pass: 'cmwxmnenbjbxrrvz'
        }
      });
      
      var mailOptions = {
        from: 'tlalocvideos@gmail.com',
        to: 'tlalocdebug@gmail.com',
        subject: 'Sending Email using Node.js',
        text: emailName + emailAccount + emailMessage
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.send('Email sent: ' + info.response);
        }
      }); 

      
})

const getHTML = async () => {
    try {
        return await axios.get('https://web.kangnam.ac.kr', {
            headers: {
                Accept: 'text/html'
            }
        });
    } catch (error) {
        console.log(error);
    }
};

app.get("/koreanews", (req, res) => {
    getHTML()
        .then(html => {
        const $ = cheerio.load(html.data);
        const $allNotices = $("ul.tab_listl div.list_txt");

        let resultArr = [];
        $allNotices.each(function(idx, element) {
            let itemObj = {
                title : $(this).children('a').attr('title'),
                url : $(this).children('a').attr('href'),
            };
            resultArr.push(itemObj);
        });
        
        resultArr.forEach((element) => {
            console.log(`현재 ${element._title}의 현황 : ${element._url}`);
        });
        return resultArr;

        // const data = ulList.filter(n => n.title);
        // return data;
    }). then((data) => res.send(data));
});

app.listen(process.env.PORT, () => {
    console.log("running")
});