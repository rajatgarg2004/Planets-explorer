//koi_disposition : Current values are CANDIDATE, FALSE POSITIVE, NOT DISPOSITIONED or CONFIRMED. All KOIs marked as CONFIRMED are also listed in the Exoplanet Archive Confirmed Planet table.
//koi_insol : Insolation flux is another way to give the equilibrium temperature. It's given in units relative to those measured for the Earth from the Sun.
//koi_prad : The radius of the planet. Planetary radius is the product of the planet star radius ratio and the stellar radius.
const Planet = require("./planets.mongo");
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const habitablePlanets = require("./planets.mongo");
const planets = [];
function canLive(data) {
    if (data['koi_disposition'] === 'CONFIRMED' && data['koi_insol'] < 1.11 && data['koi_insol'] > 0.36 && data['koi_prad'] < 1.6) {
        return true;
    }
    return false;
}
function loadPlanetsData() {
    return new Promise((resolve,reject)=>{
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data',async (data) => {
            if(canLive(data)){
            await upsertPlanets(data)
            };
        }
        )
        .on('error', (err) => {
            reject(err);
        })
        .on('end', async () => {
            const planetCounter = (await getAllPlanets()).length;
            console.log(`${planetCounter} habitable planets found`);
            resolve();
        });
    })
}
async function upsertPlanets(data)
{
    await  habitablePlanets.updateOne({
        keplerName:data.kepler_name,
    },{
        keplerName:data.kepler_name,
    },
    {
        upsert:true,
    });
}
async function getAllPlanets(){
    return await habitablePlanets.find({},"-__v -_id");
}
module.exports = {
    loadPlanetsData,
    getAllPlanets,
};

