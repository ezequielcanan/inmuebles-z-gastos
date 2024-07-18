import { Link, NavLink } from "react-router-dom"
import { MdAccountBalanceWallet, MdConstruction, MdNotifications, MdOutlineMenu } from "react-icons/md"
import { FaHelmetSafety } from "react-icons/fa6"
import { FaCertificate, FaChevronDown, FaMoneyCheckAlt, FaTicketAlt, FaUser, FaUserAlt } from "react-icons/fa"
import { HiOutlineDocument } from "react-icons/hi"
import { LuLogOut } from "react-icons/lu"
import { GiMoneyStack } from "react-icons/gi"
import { useState, useEffect, useContext } from "react"
import { socket } from "../../socket"
import CookiesJs from "js-cookie"
import Button from "../Button"
import { UserContext } from "../../context/userContext"

const Navbar = ({ user, setUser }) => {
  const [dropdown, setDropdown] = useState("")
  const [width, setWidth] = useState(window.innerWidth)
  const [nav, setNav] = useState(false)
  const {newNotification} = useContext(UserContext)

  const headerSections = [
    {
      title: "Obras",
      data: [
        { text: "Proyectos", to: "/projects", logo: MdConstruction },
        { text: "Proveedores", to: "/suppliers", logo: FaHelmetSafety },
        { text: "Presupuestos", to: "/budgets", logo: GiMoneyStack },
        { text: "Certificados", to: "/payments", logo: FaCertificate },
        { text: "Facturas", to: "/bills", logo: HiOutlineDocument },
      ]
    },
    /*{
      title: "Banco",
      data: [
        { text: "Cuentas", to: "/accounts", logo: MdAccountBalanceWallet },
      ]
    }*/
  ]

  window.addEventListener("resize", e => setWidth(window.innerWidth))

  return (
    <header className="fixed z-40 h-[120px] w-full xl:h-screen xl:w-[250px] bg-[#111]">
      <nav className="w-full px-5 py-5 flex justify-between h-full items-center xl:flex-col xl:gap-y-[40px] xl:justify-center xl:h-auto">
        <Link to={"/"} onClick={() => setNav(false)}>
          <img src="logo.svg" alt="" className="py-4 w-[200px] xl:w-auto" />
        </Link>
        <div className="md:flex md:gap-x-[20px] xl:flex-col xl:gap-y-[30px]">
          {headerSections.map((section, i) => {
            return <div key={i} className="hidden md:flex flex-col gap-y-[20px] justify-center xl:justify-start relative" onMouseLeave={() => setDropdown("")} onMouseEnter={() => width < 1280 && setDropdown(section.title)}>
              <h2 className="text-2xl text-black bg-secondary px-4 py-2 hidden md:flex items-center gap-x-[10px] cursor-pointer duration-300 hover:text-secondary hover:bg-black xl:hover:bg-transparent xl:py-0 xl:px-0 xl:text-secondary xl:bg-transparent xl:cursor-default font-bold px-3">{section.title}<FaChevronDown className="xl:hidden" /></h2>
              <ul className={`${dropdown != section.title ? "hidden" : "flex h-full"} absolute z-50 top-[100%] text-white text-xl xl:static xl:flex flex-col`}>
                {section.data.map((button, i) => {
                  const Logo = button.logo
                  return <li className={`${dropdown != section.title ? "hidden" : "block w-full h-full bg-secondary text-black hover:bg-black hover:text-secondary"} xl:block w-full`} key={i}>
                    <NavLink to={button.to} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-textColor" : ""}`} onClick={() => setNav(false)}><Logo /> {button.text}</NavLink>
                  </li>
                })}
              </ul>
            </div>
          })}
          <ul className="hidden md:flex xl:flex-col gap-x-[10px] gap-y-[20px] rounded-md text-black px-4 py-6 text-2xl">
            {/*<li className={`self-start`}>
              <Link to={"/user"}>
                <Button style="icon"><FaUser /></Button>
              </Link>
            </li>
            <li className={`relative self-start`}>
              <Link to={"/notifications"}>
                <Button style="icon"><MdNotifications /></Button>
              </Link>
              {newNotification ? <span className="absolute w-[20px] h-[20px] top-0 right-0 rounded-full bg-gradient-to-tr from-red-400 to-red-600"/> : null}
            </li>*/}
            {user ? <li className="self-start">
              <Link to={"/"} className="hidden md:flex items-center">
                <Button style="icon" className={"text-sm"} onClick={() => (CookiesJs.set("jwt", ""), setUser(false))}><LuLogOut size={30} /></Button>
              </Link>
            </li> : null}
          </ul>
        </div>

        {<div className={`${(nav && window.innerWidth < 768) ? "!left-0 bg-black" : ""} px-5 py-7 duration-300 fixed top-[100px] left-[-100%] flex flex-col gap-y-[70px] h-screen w-screen`}>
          {headerSections.map((section, i) => {
            return <div key={i} className="flex flex-col gap-y-[20px] justify-center xl:justify-start relative" onMouseLeave={() => setDropdown("")} onMouseEnter={() => window.innerWidth < 1280 && setDropdown(section.title)}>
              <h2 className="text-2xl px-4 py-2 flex items-center gap-x-[10px] text-secondary bg-transparent font-bold px-3">{section.title}</h2>
              <ul className={`text-white text-xl static flex flex-col`}>
                {section.data.map((button, i) => {
                  const Logo = button.logo
                  return <li className={`xl:block w-full`} key={i}>
                    <NavLink to={button.to} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-textColor" : ""}`} onClick={() => setNav(false)}><Logo /> {button.text}</NavLink>
                  </li>
                })}
              </ul>
            </div>
          })}
          <ul className="flex flex-col gap-x-[30px] gap-y-[20px] rounded-md text-black px-4 py-6 text-2xl">
            {/*<li className={`xl:block w-full`}>
              <Link to={"/user"}>
                <Button style="icon"><FaUser /></Button>
              </Link>
            </li>
            <li className={`xl:block w-full`}>
              <Button style="icon"><MdNotifications /></Button>
            </li>*/}
            {user ? <li className="pb-2">
              <Link to={"/"}>
                <Button style="first" className={"text-sm"} onClick={() => (CookiesJs.set("jwt", ""), setUser(false))}><LuLogOut size={30} /> Cerrar Sesion</Button>
              </Link>
            </li> : null}
          </ul>
        </div>}
        <MdOutlineMenu className="text-white text-6xl md:hidden cursor-pointer" onClick={() => (setNav(!nav))} />
      </nav>
    </header>
  )
}

export default Navbar