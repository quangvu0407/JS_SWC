import axios from 'axios'

const instace = axios.create({
  baseURL: 'http://localhost:8017'
})

//Add request intersector
instace.interceptors.request.use(function (config) {
  // console.log('check store', store.getState())

  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

instace.interceptors.response.use(function (response) {
  // console.log("<<<intercepter: ", response)
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response && response.data ? response.data : response
}, function (error) {

  if (error.response.data && error.response.data.EC === -999) {
    window.location.href = '/'
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // console.log(">>> run error: ", error.response)
  return error && error.response && error.response.data
    ? error.response.data : Promise.reject(error);
})

export default instace