import Router from "./Router/router"
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
