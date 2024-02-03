import { HashRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Navbar from "../components/Navbar"


const Router = () => {
  return (
    <HashRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </HashRouter>
  )
}

export default Router