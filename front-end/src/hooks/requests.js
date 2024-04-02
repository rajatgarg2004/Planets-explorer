const API_URL = "v1";

async function httpGetPlanets() {
  const data = await fetch(`${API_URL}/planets`);
  const result = await data.json();
  console.log(result);
  return result;
}

async function httpGetLaunches() {
  const data = await fetch(`${API_URL}/launches`);
  let result = await data.json();
  result.sort((a,b)=>{
    return a.flightNumber-b.flightNumber;
  })
  return result;
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try{
    return await fetch(`${API_URL}/launches`,{
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
    },
    body: JSON.stringify(launch),
  })
  }
  catch(err){
    return {
      ok:false,
    }
  }
  
}

async function httpAbortLaunch(id) {
  try{
     return await fetch(`${API_URL}/launches/${id}`,{
      method: 'DELETE',
     })
  }
  catch(err){
    console.log(err);
    return {
      ok:false,
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};