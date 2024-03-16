// Using SpaceX api to get data of past launches
const axios = require("axios");
const mongoose = require('mongoose');
const Launch = require('./launches.mongo');
const habitablePlanet = require("./planets.mongo")
const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100;

//Using version 5 of SpaceX api
const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";
async function populateLaunches() {
    console.log("Loading data");
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1,
                    }
                },
                {
                    path: "payloads",
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })
    if(response.status!==200)
    {
        throw new Error("Error downloading the data");
    }
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }
        await saveLaunch(launch);
    }

}
async function loadLaunchesData() {
    const firstLaunch = await Launch.findOne({
        flight_number: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })
    if (firstLaunch) {
        console.log("Data already loaded");
    }
    else {
        await populateLaunches();
    }
}

async function findLaunch(filter) {
    return await Launch.findOne(filter);
}
async function getAllLaunches(skip , limit) {
    console.log(skip,limit);
    return await Launch.find({}, {
        _id: 0,
        __v: 0,
    })
    .sort({flightNumber : 1})
    .skip(skip)
    .limit(limit);
}
async function existsWithLaunchId(launchId) {
    return await findLaunch({ flightNumber: launchId });
}
async function abortByLaunchId(launchId) {
    const aborted = await Launch.updateOne({ flightNumber: launchId }, {
        upcoming: false,
        success: false,
    });
    return aborted.modifiedCount === 1;
}
async function getLatestLaunch() {
    const latestLaunch = await Launch.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}
async function saveLaunch(launch) {
    await Launch.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    })
}
async function scheduleNewLaunch(launch) {
    const planet = await habitablePlanet.findOne({
        keplerName: launch.target,
    })
    if(!planet)
    {
        throw new Error("No matching planet found"); 
    }
    const newFlightNumber = await getLatestLaunch() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Rajat', 'ISRO'],
        flightNumber: newFlightNumber,
    })
    await saveLaunch(newLaunch);
}
module.exports = {
    loadLaunchesData,
    existsWithLaunchId,
    getAllLaunches,
    scheduleNewLaunch,
    abortByLaunchId,
}