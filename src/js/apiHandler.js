const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "accept": "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
});

async function fetchInfo(endpoint, query) {
  const {data} = query !== "" ? await api(endpoint, {params: query}): await api(endpoint);
  let x = 0;

  return await new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(data);
    }, 2000)
  });
}



export { fetchInfo };