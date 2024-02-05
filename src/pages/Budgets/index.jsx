import Main from "../../containers/Main"
import Title from "../../components/Title"
import Button from "../../components/Button"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"

const Budgets = () => {
  return (
    <Main className={"flex flex-col"} paddings>
      <section className="flex w-full justify-between items-center">
        <Title>
          Presupuestos
        </Title>
        <Link to={"/budgets/new"}>
          <Button>Agregar presupuesto <FaPlus/></Button>
        </Link>
      </section>
    </Main>
  )
}

export default Budgets