import { useParams, Link } from "react-router-dom"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import customAxios from "../../config/axios.config"
import { FaChevronLeft } from "react-icons/fa6"
import Subtitle from "../../components/Subtitle"
import Section from "../../containers/Section"
import BudgetCard from "../../components/BudgetCard"
import Button from "../../components/Button"
import BillCard from "../../components/BilllCard"

const ProjectAndSupplierBudgets = () => {
  const { pid, sid } = useParams()
  const [project, setProject] = useState()
  const [budgets, setBudgets] = useState([])
  const [bills, setBills] = useState([])

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload || "error")
    }).catch(e => {
      setProject("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/bill/${pid}/${sid}`).then(res => {
      setBills(res?.data?.payload)
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/budget/project/${pid}?sid=${sid}`).then(res => {
      setBudgets(res?.data?.payload)
    })
  }, [])

  return (
    <Main className={"flex flex-col pt-[150px] pb-[120px] gap-y-[70px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"}>
      <Link to={`/projects/${pid}`}><FaChevronLeft size={50} /></Link>
      {project ? (
        project != "error" ? (
          <>
            <Section>
              <Title>{project.title} - {budgets[0]?.supplier?.name}</Title>
              <Link to={`/projects/${pid}/${sid}/new-bill`}>
                <Button>
                  Nueva factura
                </Button>
              </Link>
            </Section>
            <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
              {budgets?.length ? budgets?.map((budget) => {
                return <BudgetCard key={budget?._id} budget={budget} />
              }) : <h2>No hay presupuestos de este proyecto</h2>}
            </section>
            {bills?.length ? (
              <section className="flex flex-col gap-y-[30px]">
                <Subtitle className={"self-start"}>Facturas</Subtitle>
                <div className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
                  {bills.map((bill) => {
                    return <BillCard path={`/projects/${pid}/${sid}/${bill?._id}`} bill={{ bill }} concept={false} key={bill?._id} />
                  })}
                </div>
              </section>) : null}
          </>
        ) : (
          <Title className={"text-center"}>No existe ese proveedor</Title>
        )
      ) : (
        <BounceLoader size={100} />
      )}
    </Main>
  )
}

export default ProjectAndSupplierBudgets