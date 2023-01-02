import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: 'http://localhost:8081', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 0 // request timeout
})

export default service
