import Axios from "axios";

const authInstance = Axios.create({
    baseURL: process.env.REACT_APP_API_URL + "/api/v1"
})

const token = localStorage.getItem('token')
authInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`

const commonInstance = Axios.create({
    baseURL: process.env.REACT_APP_API_URL + "/v1"
})


export { authInstance, commonInstance }