async function httpGetPlanets() {
  const data = await fetch('http://localhost:8000/planets');
  const result = await data.json();
  console.log(result);
  return result;
}

async function httpGetLaunches() {
  const data = await fetch('http://localhost:8000/launches');
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
    return await fetch('http://localhost:8000/launches',{
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
     return await fetch(`http://localhost:8000/launches/${id}`,{
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