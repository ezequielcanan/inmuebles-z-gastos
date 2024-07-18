import { createContext, useState, useEffect } from "react"
import CookiesJs from "js-cookie"
import { socket } from "../socket"
import customAxios from "../config/axios.config"

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(CookiesJs.get("jwt") ? true : false)
  const [userData, setUserData] = useState(false)
  const [messages, setMessages] = useState([])
  const [newNotification, setNewNotification] = useState(false)

  const getUser = () => user

  useEffect(() => {
    if (user) {
      customAxios.get(`/user/current`).then(res => {
        const userObj = res?.data?.payload
        socket.emit("connectEvt", userObj)
        setUserData(userObj)
      })
  
      const onNewMessage = () => {
        setNewNotification(true)
        //new Audio("/notification.wav").play()
      }

      const onMessages = data => {
        setMessages(data)
      }
  
      socket.on("messages", onMessages)
      socket.on("newMessage", onNewMessage)
    }
  }, [])

  

  return (
    <UserContext.Provider value={{ user, userData, setUser, getUser, messages, newNotification, setNewNotification, setMessages }}>
      {children}
    </UserContext.Provider>
  )
}