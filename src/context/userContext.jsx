import { createContext, useState } from "react"
import CookiesJs from "js-cookie"

export const UserContext = createContext()

export const UserContextProvider = ({children}) => {
  const [user,setUser] = useState(CookiesJs.get("jwt") ? true : false)

  const getUser = () => user

  return (
    <UserContext.Provider value={{user,setUser,getUser}}>
      {children}
    </UserContext.Provider>
  )
}