import Main from "../../containers/Main"
import Title from "../../components/Title"
import Button from "../../components/Button"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import Section from "../../containers/Section"
import { useEffect, useState } from "react"
import customAxios from "../../config/axios.config"
import { BounceLoader } from "react-spinners"
import BudgetCard from "../../components/BudgetCard"

const Budgets = () => {
  const [budgets, setBudgets] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    customAxios.get("/budget").then(res => {
      setBudgets(res?.data?.payload || [])
    }).catch(e => {
      setBudgets("error")
    })
  }, [reload])


  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <Section>
        <Title>
          Presupuestos
        </Title>
        <Link to={"/budgets/new"}>
          <Button>Agregar presupuesto <FaPlus/></Button>
        </Link>
      </Section>
      <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
        {(budgets && budgets != "error") ? (
            budgets.map((budget,i) => {
              return <BudgetCard budget={budget} key={budget?._id} setReload={setReload}/>
            })
          ) : (
            !budgets?.length ? <p>No hay presupuestos</p> : <BounceLoader/>
          )}
      </section>
    </Main>
  )
}

export default Budgets