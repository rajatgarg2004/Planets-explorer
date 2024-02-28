const launches = new Map();
let latestFlightNumber = 100;
const launch = {
    flightNumber : 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explore IS1',
    launchDate : new Date('December 27, 2030'), 
    target : 'Kepler-442 b',
    customer : ['NASA, Rajat'],
    upcoming:true,
    success:true,
}
launches.set(launch.flightNumber,launch);
function getAllLaunches(){
    return Array.from(launches.values());
}
function existsWithLaunchId(launchId){
    return launches.has(launchId);
}
function addNewLaunch(launchData){
    latestFlightNumber++;
    return launches.set(latestFlightNumber,Object.assign(launchData,{
        success:true,
        upcoming: true,
        customers : ['Rajat','ISRO'],
        flightNumber : latestFlightNumber,
    }));
}
function abortByLaunchId(launchId){
    const aborted = launches.get(launchId);
    aborted.success = false;
    aborted.upcoming = false;
    return aborted;
}
module.exports={
    existsWithLaunchId,
    getAllLaunches,
    addNewLaunch,
    abortByLaunchId,
}