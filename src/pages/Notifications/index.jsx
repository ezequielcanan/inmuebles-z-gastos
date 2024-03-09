import { useEffect, useState, useContext } from "react"
import { UserContext } from "../../context/userContext"
import Section from "../../containers/Section"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import NotificationCard from "../../components/NotificationCard"
import customAxios from "../../config/axios.config"

const Notifications = () => {
  const [messages, setMessages] = useState(false)
  const { userData, getUser, messages: messagesContext, setNewNotification } = useContext(UserContext)

  useEffect(() => {
    if (userData?._id) {
      customAxios.get(`/message/${userData?._id}`).then(res => {
        setMessages(res?.data?.payload || false)
      })
      setNewNotification(false)
    }
  }, [messagesContext])


  return <Main className={"flex flex-col gap-y-[70px]"} paddings>
    <Section>
      <Title>Notificaciones</Title>
    </Section>
    <section className="flex flex-col gap-y-[20px]">
      {(messages && messages.length) ? messages?.map((message) => {
        return <NotificationCard message={message} key={message?._id} />
      }) : (
        <h1>No hay notificaciones</h1>
      )}
    </section>
  </Main>
}

export default Notifications