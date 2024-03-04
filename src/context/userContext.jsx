import { createContext, useState, useEffect } from "react"
import CookiesJs from "js-cookie"
import { socket } from "../socket"
import customAxios from "../config/axios.config"

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(CookiesJs.get("jwt") ? true : false)

  const getUser = () => user

  useEffect(() => {
    if (user) {
      customAxios.get(`/user/current`).then(res => {
        const userObj = res?.data?.payload
        socket.emit("connectEvt", userObj)
      })
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, getUser }}>
      {children}
    </UserContext.Provider>
  )
}