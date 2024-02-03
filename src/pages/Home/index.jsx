import Button from "../../components/Button"
import { FaArrowRight } from "react-icons/fa"
import Main from "../../containers/Main"

const Home = () => {
  return (
    <Main className={"w-screen min-h-screen bg-[url('/home.jpg')] bg-no-repeat bg-cover bg-blend-multiply bg-[#444] flex flex-col pt-[250px] items-center px-[50px]"}>
      <div className="grid gap-y-[70px]">
        <div className="grid gap-y-[40px]">
          <h1 className="text-5xl md:text-7xl font-bold title">Gastos &<br />Balances</h1>
          <p className="text-lg md:text-2xl text-white">Aplicacion para manejo de obras y proveedores.</p>
        </div>
        <Button style="first">
          Iniciar sesion <FaArrowRight/>
        </Button>
      </div>
    </Main>
  )
}

export default Home