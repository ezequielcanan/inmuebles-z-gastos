import { useParams, Link } from "react-router-dom"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import customAxios from "../../config/axios.config"
import { Fa0, FaChevronLeft } from "react-icons/fa6"
import Section from "../../containers/Section"
import BudgetCard from "../../components/BudgetCard"

const Project = () => {
  const { pid } = useParams()
  const [project, setProject] = useState()
  const [budgets, setBudgets] = useState()

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload || "error")
    }).catch(e => {
      setProject("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/budget/project/${pid}`).then(res => {
      console.log(res?.data)
      setBudgets(res?.data?.payload)
    })
  }, [])

  return (
    <Main className={"flex flex-col pt-[150px] gap-y-[40px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"}>
      <Link to="/projects"><FaChevronLeft size={50}/></Link>
      {project ? (
        project != "error" ? (
          <>
            <Section>
              <Title>{project.title}</Title>
            </Section>
            <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
              {budgets?.length ? budgets?.map((budget) => {
                return <BudgetCard budget={budget}/>
              }) : <h2>No hay presupuestos de este proyecto</h2>}
            </section>
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

export default Project