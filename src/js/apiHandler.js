const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "accept": "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
});

async function fetchInfo(endpoint) {
  const {data} = await api(endpoint);
  console.log(endpoint);
  return data;
}

export { fetchInfo };