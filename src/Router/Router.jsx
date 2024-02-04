import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { UserContext } from "../context/userContext"
import { useContext } from "react"
import Home from "../pages/Home"
import Navbar from "../components/Navbar"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Suppliers from "../pages/Suppliers"
import NewSupplier from "../pages/NewSupplier"
import Supplier from "../pages/Supplier"

const Router = () => {
  const { getUser, setUser } = useContext(UserContext)


  return (
    <HashRouter>
      <Navbar user={getUser()} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={getUser()} />} />
        {!getUser() ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to={"/login"} />} />
          </>
        ) : (
          <>
            <Route path="/suppliers" element={<Suppliers/>}/>
            <Route path="/suppliers/:sid" element={<Supplier/>}/>
            <Route path="/suppliers/new" element={<NewSupplier/>}/>
          </>
        )}
      </Routes>
    </HashRouter>
  )
}

export default Router