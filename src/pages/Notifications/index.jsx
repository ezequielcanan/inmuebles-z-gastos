import { useEffect, useState, useContext } from "react"
import { UserContext } from "../../context/userContext"
import Section from "../../containers/Section"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import NotificationCard from "../../components/NotificationCard"

const Notifications = () => {
  const [messages, setMessages] = useState(false)
  const { getUser, messages: messagesContext, setNewNotification } = useContext(UserContext)

  useEffect(() => {
    setMessages(messagesContext)
    setNewNotification(false)
  }, [messagesContext])


  return <Main className={"flex flex-col gap-y-[70px]"} paddings>
    <Section>
      <Title>Notificaciones</Title>
    </Section>
    <section className="flex flex-col gap-y-[20px]">
      {(messages && messages.length) ? messages?.map((message) => {
        return <NotificationCard message={message} />
      }) : (
        <h1>No hay notificaciones</h1>
      )}
    </section>
  </Main>
}

export default Notifications