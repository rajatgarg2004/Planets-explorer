const http = require('http');
const app = require('./app');
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const {loadPlanetsData,planets} = require('./models/planets.model');
const {loadLaunchesData} = require('./models/launches.model');
const {mongoConnect} = require("./services/mongo");

async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();
    server.listen(PORT,(err)=>{
        if(err)
        {
            console.warn(err);
        }
        else{
            console.log(`Successfully connected to Port: ${PORT}`)
        }
    })
}
startServer();