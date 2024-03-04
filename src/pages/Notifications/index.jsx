import { useEffect, useState, useContext } from "react"
import { socket } from "../../socket"
import { UserContext } from "../../context/userContext"
import Main from "../../containers/Main"

const Notifications = () => {
  const [messages, setMessages] = useState(false)
  const [reload, setReload] = useState(false)
  const { getUser } = useContext(UserContext)

  useEffect(() => {
    if (getUser()) {
      const onNewMessage = () => {
        setReload(!reload)
        new Audio("/notification.wav").play()
      }

      const onMessages = console.log

      socket.emit("getMessages")
      socket.on("messages", onMessages)
      socket.on("newMessage", onNewMessage)

      return () => {
        socket.off("newMessage", onNewMessage)
      }
    }
  }, [reload])

  return <Main>
    
  </Main>
}

export default Notifications