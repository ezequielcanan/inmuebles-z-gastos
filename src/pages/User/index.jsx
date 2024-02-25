import { useEffect, useState } from "react"
import Main from "../../containers/Main"
import customAxios from "../../config/axios.config"
import { BounceLoader } from "react-spinners"
import Title from "../../components/Title"
import Section from "../../containers/Section"
import { FaUserAlt } from "react-icons/fa"
import Subtitle from "../../components/Subtitle"
import { socket } from "../../socket"
import moment from "moment"

const User = () => {
  const [user, setUser] = useState(false)
  const [users, setUsers] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    customAxios.get("/user/current").then(res => {
      setUser(res?.data?.payload)
    }).catch(e => {
      setUser("error")
    })
  }, [reload])

  useEffect(() => {
    customAxios.get("/user").then(res => {
      const usersRes = res?.data?.payload
      const users = [...usersRes.executive, ...usersRes.secretary, ...usersRes.user, ...usersRes.admin]
      setUsers([...users])
    }).catch(e => {
      setUsers("error")
    })
  }, [reload])

  const changePermissionOfUser = async (uid) => {
    await customAxios.put(`/user/${user?._id}/notifications/${uid}`)
    setReload(!reload)
  }

  const onClickMessage = () => {
    user?.notifications?.forEach((u) => {
      const messageObj = {text: "pruebaasdasd", dateTime: moment(), from: user?._id, to: u}
      
      socket.emit("sendMessage", {message: messageObj, receiver: u})
    })
  }

  const roles = {
    secretary: "Secretario",
    executive: "Ejecutivo",
    user: "Usuario",
    unknow: "Desconocido",
    admin: "Administrador"
  }

  return (
    <Main className={"flex flex-col items-center gap-y-[80px] xl:items-start"} paddings>
      {(user && user != "error" && users && users != "error") ? (
        <>
          <Section className={"!justify-start bg-secondary px-2 py-5 rounded"}>
            <FaUserAlt className="text-8xl border-r-4 border-black px-5"/>
            <div className="flex flex-col gap-y-[20px] px-5">
              <Title>{user.name}</Title>
              <h2>{user.email}</h2>
            </div>
          </Section>
          <section className="gap-y-[30px] flex flex-col">
            <Subtitle>Notificaciones</Subtitle>
            <div className="grid grid-cols-3 gap-8">
              {users.map((u,i) => {
                return <div key={u._id} className="flex gap-x-[20px] bg-third shadow-lg p-5">
                  <div className="flex flex-col">
                    <h3 className="font-ubuntu text-3xl">{u.name}</h3>
                    <p>{roles[u.role]}</p>
                  </div>
                  {u._id != user?._id && <input type="checkbox" className="w-[50px]" defaultChecked={user?.notifications?.includes(u?._id)} onChange={() => changePermissionOfUser(u?._id)}/>}
                </div>
              })}
            </div>
            <button onClick={onClickMessage}>Send</button>
          </section>
        </>
      ) : (!user || !users) ? <BounceLoader size={100}/> : <Title>Se ha producido un error</Title>}
    </Main>
  )
}

export default User