import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { CiMail } from "react-icons/ci"
import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { UserContext } from "../../context/userContext"
import customAxios from "../../config/axios.config"
import Main from "../../containers/Main"
import Form from "../../components/Form"
import Input from "../../components/FormInput/Input"

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext)
  const { register, handleSubmit } = useForm()
  const [error,setError] = useState(false)
  const [visible, setVisible] = useState(false)

  const onSubmit = handleSubmit(async data => {
    try {
      const res = (await customAxios.post("/session/login", data)).data
      !res.payload ? setError(true) : (navigate("/"), setUser(true))
    }
    catch(e) {
      setError(true)
    }
  })
  return (
    <Main className={"bg-gradient-to-tr from-stone-400 to-orange-300 w-screen h-screen flex flex-col items-center justify-center"}>
      <div className="bg-secondary flex flex-col gap-y-[100px] items-center py-7 px-7">
        <FaUserCircle className="text-white" size={180} />
        <Form className={"gap-y-[70px]"} onSubmit={onSubmit}>
          <Input register={{ ...register("email") }} placeholder={"Email"} containerClassName={"border-b-4 text-white"}>
            <CiMail size={50} />
          </Input>
          <Input register={{ ...register("password") }} placeholder={"Contraseña"} type={visible ? "text" : "password"} containerClassName={"border-b-4 text-white"}>
            <div onClick={() => setVisible(!visible)}>
              {visible ? <FaEye size={50} /> : <FaEyeSlash size={50}/>}
            </div>
          </Input>
          <div className="flex flex-col gap-y-[30px]">
            {error ? <p className="text-3xl bg-red-600 w-full py-2 px-3 text-white">Email o contraseña incorrectos</p> : null}
            <div className="flex justify-between w-full text-white text-2xl items-center">
              <p>No tenes un usuario?</p>
              <Link to={"/register"} className="bg-orange-600 py-2 px-3">Registrate</Link>
            </div>
            <button type="submit" className="w-full bg-third py-3 px-3 text-4xl">Iniciar sesion</button>
          </div>
        </Form>
      </div>
    </Main>
  )
}

export default Login