const {getAllLaunches,addNewLaunch,existsWithLaunchId, abortByLaunchId} = require('../../models/launches.model');

function httpGetAllLaunches(req,res){
    return res.status(200).json(getAllLaunches());
}
function httpAddNewLaunch(req,res){
    launch = req.body ;
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target)
    {
        return res.status(400).json({
            error: "Missing Field",
        })
    }
    launch.launchDate  = new Date(launch.launchDate);
    if(isNaN(launch.launchDate))
    {
        return res.status(400).json({
            error: "Invalid Launch Date",
        })
    }
    addNewLaunch(launch);
    return res.status(201).json(launch);
}
function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id);
    if(!existsWithLaunchId(launchId))
    {
        return res.status(404).json({
            error : 'Launch Not Found',
        });
    }
    const aborted = abortByLaunchId(launchId);
    return res.status(200).json(aborted);
}
module.exports={
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}