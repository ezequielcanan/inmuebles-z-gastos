import Router from "./Router/Router.jsx"
import customAxios from "./config/axios.config"
import { useEffect } from "react"
import { socket } from "./socket"
import { UserContextProvider } from "./context/userContext"

const App = () => {


  return (
    <UserContextProvider>
      <Router />
    </UserContextProvider>
  )
}

export default App
