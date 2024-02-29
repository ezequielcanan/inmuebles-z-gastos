import axios from "axios"

const customAxios = axios.create({
  baseURL: "http://inmueblesz.ddns.net:3000/api",
  withCredentials: true
})

export default customAxios