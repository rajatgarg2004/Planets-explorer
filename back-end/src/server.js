const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const {loadPlanetsData,planets} = require('./models/planets.model')
async function startServer(){
    await loadPlanetsData();
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