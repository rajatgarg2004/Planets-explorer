const express = require('express');
const cors = require('cors');
const path = require('path');
const planetRouter = require('./routes/planets/planets.router');
const launchRouter = require('./routes/launches/launches.router');
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
})); 

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname,'..','public')));
app.use('/planets',planetRouter);
app.use('/launches',launchRouter);

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})
module.exports = app;